const {Router} = require('express')
const fs = require('fs')
const path = require('path')
const TimeTable = require('../models/timeTable')
const Group = require('../models/groups')
const Journal = require('../models/journal')
const router = Router()
const auth = require('../middleware/auth')


router.post('/getAttendance',auth,async (req,res)=>{
    const group = req.session.user
    const dayOfTheWeek= Object.keys(req.body)[0];
    const attendance = await Journal.findById(group)
    if(attendance){
        const candidate = attendance.attendance.findIndex(g=>g.date===dayOfTheWeek)
        if(candidate>=0){
            res.json(attendance.attendance[candidate].groupAttendance)
        }
        else{
            res.json(false)
            }
    } 
    else{
    res.json(false)
    }
})


router.get('/',auth,async(req,res)=>{
    const user = req.session.user
    const day = new Date().getDay()
    const timeTable = await TimeTable.findById(user)
   
    const group = await Group.findById(user);
    const students = group?group.students:false
    const dayOfTheWeek= getDay()

    const disabled = new Date().getDay()===0||new Date().getDay()>5?'disabled':''
    
    res.render('journal',{
        group:user,
        disabled: disabled,
        dayOfTheWeek,
        timeTable:timeTable.schedule[day-1],
        students:students,
        title: 'Журнал',
        isJournal:true
    })
})

router.post('/timeDate',auth,async (req,res)=>{
  const group = req.session.user
  const data= await req.body
  const date=Object.keys(data)[0];
  const day = new Date(date).getDay()

    const Allshedule = await TimeTable.findById(group)
    const timeTable =  Allshedule.schedule[day-1]
   
    res.json(timeTable)
   
})

router.post('/addAttendance',auth, async(req,res)=>{
    const group = req.session.user
    const data = req.body
    await getAttendance(group,data.date,data)
    res.redirect('/journal')
})


router.post("/upload",auth, async function(req, res) {
    const group = req.session.user
    await readFileAttendance(req.file.path,req.body.date,group)

    res.redirect('/journal')
});



//функции помогут нам летать в темноте
    function getDay(){
        const date=new Date().toLocaleString('ru').split(' ')[0].split('-').reverse().join('.')
        const d = +date.split('.')[0]<10 ? '0'+date.split('.')[0]:date.split('.')[0]
        const m = +date.split('.')[1]<10?'0'+date.split('.')[1] : +date.split('.')[1]
        const y = +date.split('.')[2]

        switch(new Date().getDay()){
            case 1: return `Понедельник ${d}.${m}.${y}`
            case 2: return `Вторник ${d}.${m}.${y}`
            case 3: return `Среда ${d}.${m}.${y}`
            case 4: return `Четверг ${d}.${m}.${y}`
            case 5: return `Пятница ${d}.${m}.${y}`
            case 6: return `Суббота ${d}.${m}.${y}`
            case 0: return `Воскресенье ${d}.${m}.${y}`
        }
    }

   

    async function getAttendance(groupId,date,attendance){
       
                const groupAttendance=[]
        
                let idx=0
                let lesson={
                   first:'',
                   second:'',
                   third:'',
                   fourth:''
                }
        
                for (const key in attendance){
                   
                        idx++
                        switch(idx){
                            case 1: lesson.first = attendance[key];break;
                            case 2: lesson.second = attendance[key];break;
                            case 3: lesson.third = attendance[key];break;
                            case 4: lesson.fourth = attendance[key];break;
                        }
                        if(idx%4===0){
                            idx=0
                            groupAttendance.push(lesson)
                            lesson={
                                first:'',
                                second:'',
                                third:'',
                                fourth:''
                            }
                        }
                }
                
                const journal = await Journal.findById(groupId)
              
                if(journal){
                   const candidateDate=journal.attendance.findIndex(e=>e.date===date)
                   if(candidateDate>=0){
                        journal.attendance[candidateDate].groupAttendance=groupAttendance
                   }else{
                        journal.attendance.push({date,groupAttendance})
                   }
                   await Journal.findByIdAndUpdate(groupId,journal)
                }else{
                    //console.log(groupAttendance)
                    const newJournal = new Journal({
                        _id:groupId,
                        attendance:{date,groupAttendance:groupAttendance}
                    })
                    newJournal.save()
                }
                
            }
        //     //end addAttendance

        //start add Attendance from file
    async function readFileAttendance(file,date,group){
        const pathFile=path.join(__dirname,"..",file);
        
        fs.readFile(
        pathFile,
        (err,data)=>{
            if(err)throw err
            let myResult=[]
            let result=Buffer.from(data).toString();
            let newResult='';
            for (let index = 0; index < result.length; index++) {
                const element = result[index];
                if(element==='0' || element==='1'){
                    newResult+=element;
                    if(newResult.length%12===0 && newResult.length>36){
                        myResult.push(newResult.slice(newResult.length-12,newResult.length))
                    }
                }
            }
            
            calculate(myResult)
            
            fs.unlink(pathFile, (err) => {
                if (err) console.log(err); // если возникла ошибка	
                else console.log(pathFile," was deleted");
              });
           
        }
    )
    //продолжение следует колбек
    const calculate=(array)=>{
        //console.log(array)
        let newResult=[]
       

        for (let index = 0; index < array.length; index++) {
            let numberLesson=1;
            let lesson={
                first:"",
                second:"",
                third:"",
                fourth:""
            }

            const element = array[index];
            for (let index = 0; index < element.length; index++) {

               if((index+1)%3===0){
                    let res=element.slice(index+1-3,index+1);
                    let mark;
                    if(res[0]==='1'){
                        mark="Op"
                    }
                    if(res[1]==='1'){
                        mark="Uv"
                    }
                    if(res[2]==='1'){
                        mark="minus"
                    }
                    if(!mark)mark="plus";

                    switch(numberLesson){
                        case 1: {
                            lesson.first=mark
                        }
                        case 2: {
                            lesson.second=mark
                        }
                        case 3: {
                            lesson.third=mark
                        }
                        case 4: {
                            lesson.fourth=mark
                        }
                    }
                    numberLesson++
               }
                
            }

            newResult.push(lesson);
        }
        //console.log(newResult)
        addAttendancefromFile(newResult,date,group)
        }
    }
    //end read File

     async function addAttendancefromFile(attendance,date,group){
         
        const journal = await Journal.findById(group)
        const myGroup  = await Group.findById(group)
        const groupAttendance = attendance.slice(0,myGroup.students.length)
       
        if(journal){
            const candidateDate=journal.attendance.findIndex(e=>e.date===date)
            if(candidateDate>=0){
                 journal.attendance[candidateDate].groupAttendance=groupAttendance
            }else{
                 journal.attendance.push({date,groupAttendance})
            }
            await Journal.findByIdAndUpdate(group,journal)
         }else{
             const newJournal = new Journal({
                 _id:group,
                 attendance:{date,groupAttendance:groupAttendance}
             })
             newJournal.save()
         }

    }
//     //end addAttendanceFromFile

module.exports = router