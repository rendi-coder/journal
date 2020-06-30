const {Router} = require('express')
const router = Router()



router.get('/',(req,res)=>{
    res.render('index',{
        title: 'Главная 105 кафедра',
        isHome:true
    })
})





module.exports = router