const {Router}= require('express')
const Group = require('../models/groups')
const User = require('../models/user')
const admin = require('../middleware/admin')
const router = Router()

router.get('/',admin,(req,res)=>{
    res.render('group',{
        isGroup:true,
        title:'Группы'
    })
})

router.post('/show/',admin,async (req,res)=>{
    const groupId = Object.keys(req.body)[0]
    try{
    const groups = await Group.findById(groupId)
    if(groups){
        res.json(groups.students)
    }
    res.json(false)
    }
    catch(e){console.log(e)}
})


router.post('/add',admin,async(req,res)=>{
    const id = req.body['groupId']
    const pass = req.body['password']
    delete req.body.groupId
    delete req.body.password
   
    const students=[]
    let student={id:'',surname:'',name:'',fname:''}
    let idx=0;
    let idIdx=1;
    for (const key in req.body) {
        const candidate=req.body[key]
       if(candidate.length){     
                    switch(idx){
                        case 0:student.surname = candidate;break;
                        case 1:student.name = candidate;break;
                        case 2:student.fname = candidate;student.id=idIdx;break;
                    }
        
                    idx++;
        
                    if(idx===3){
                        students.push(student)
                        student={id:'',surname:'',name:'',fname:''}
                        idx=0;
                        idIdx++
                    }
                }
       }
    
    const groups = await Group.findById(id)
    if(groups){
        try{
       await Group.findByIdAndUpdate(id,{_id:id,students:students})
        res.render('group',{
        isGroup:true,
        title:'Группы'
        })
        }catch(e){console.log(e)}
    }
    else{
    const group = new Group({
        _id:id,
        students:students
    })

    try{
    await group.save()
    
    if(id,pass){
        const user = new User({
            _id:id,
            password:pass
        })
        await user.save()
    }
    
    res.render('group',{
        isGroup:true,
        title:'Группы'
    })
    }catch(e){
        console.log(e)
    }
    }
})


module.exports = router