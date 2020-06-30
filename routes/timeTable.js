const {Router} = require('express')
const TimeTable = require('../models/timeTable')
const admin = require('../middleware/admin')
const router = Router()

router.get('/',admin,(req,res)=>{
    res.render('timeTable',{
        title: 'Расписание',
        isTimetable:true
    })
})

router.get('/:id', async (req, res) => {
    const groupID = req.params.id.split(':')[1]
    const timeTable = await TimeTable.findById(groupID)
    res.json(timeTable)
  })

router.post('/',admin,async(req,res)=>{
    const timeTable = schedule(req.body)
    const result = await TimeTable.findById(req.body.group)
    console.log(result)
    if(result){
       await TimeTable.findByIdAndUpdate(req.body.group,{
            _id:req.body.group,
            schedule:timeTable
        })
    }
    else{
    groupShedule = new TimeTable({
        _id:req.body.group,
        schedule:timeTable
    })
    try{
    groupShedule.save()
    }catch(e){console.log(e)}
    }
    res.redirect('/')
})


function schedule(data){
    let monday=[]
    let tuesday=[]
    let wednesday=[]
    let thursday=[]
    let friday =[]

    let lessonIdx=0; let dayIdx=0; let day=1;

    let lesson={}

    for (const key in data) {
        if(key==='group')break
        
        lessonIdx++;
        dayIdx++;

        if(lessonIdx===1){
            lesson.subject = data[key]
        }else{
            lesson.teacher = data[key]

            switch(day){
                case 1: monday.push(lesson); break;
                case 2: tuesday.push(lesson); break;
                case 3: wednesday.push(lesson); break;
                case 4: thursday.push(lesson); break;
                case 5: friday.push(lesson); break;
            }
            lessonIdx=0;
            lesson={}

            if(dayIdx%8==0){day++;dayIdx=0;}
            if(day===6)day=0;
        }
    }
    return [monday,tuesday,wednesday,thursday,friday]
}


module.exports = router