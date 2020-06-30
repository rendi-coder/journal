const {Router} = require('express')
const User = require('../models/user')

const router = Router()

router.get('/login',(req,res)=>{
    res.render('auth/login',{
        title: 'Авторизация',
        isLogin:true
    })
})

router.get('/logout',(req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/auth/login')
    })
})

router.post('/login',async(req,res)=>{
    try{
    const{login,pass}=req.body
    const user = await User.findById(login)
    if(!user){ 
        res.render('auth/login',{
        error:true,
        title: 'Авторизация',
        isLogin:true
    })}
    else{
        const candidate=user.password===pass
        if(candidate){
            req.session.user = user._id
            if(user._id==='admin'){
                req.session.isAdmin=true
            }else{
                req.session.isAuthenticated = true
            }
            req.session.save(err=>{
                if(err){
                    throw err
                }
            })
            res.redirect('/')
        }else{res.render('auth/login',{
            error:true,
            title: 'Авторизация',
            isLogin:true
        })}
    }
    
    }
    catch(e){
        console.log(e)
    }
})

module.exports = router