const Users = require('../models/user')
const passport = require('passport')
const emailController = require('./email-controller')

exports.register = async (req,res, next) => {
    try {
        var errors = []
        const {email, password, name } = req.body
        user = await Users.findOne({email})
        if(user){
            errors.push({msg: 'Email address has already been used'})
            return res.render('users/register', {email,name, errors})
        }else{
            const newUserData = {email: email, password: password, username: email.split('@')[0], name: name}
            const newUser = new Users(newUserData)
            const _user = await newUser.save()
            next()
        }
        
    } catch (error) {
        console.log(error)
    }
}
///Check 
exports.verify = async (req, res, next) => {
    try{
        const {email, password} = req.body
        user = await Users.findOne({email})
        if(!user) return next()
        if(!user.comparePassword(password)) return next()
        if(!user.isVerified){
            return res.redirect('/verify/' + user._id)
        }
        next()
    }catch(err){
        console.log(err)
    }
}
exports.login = async (req,res, next) => {
    try {
        await passport.authenticate('local', 
        {
            successRedirect: '/',
            failureRedirect: 'login',
            failureFlash:true ,
            passReqToCallback: true
        })(req,res,next)
    }
    catch(error){
        console.log(error)
    }
}

exports.logout = (req,res, next) => {
    req.session.destroy((err)=>{
        res.redirect('login')
    })
}

//--- CHECK THE AUTHENTICATION STATUS ---
exports.isNotAuthenticated = (req,res,next) => {
    if(req.isAuthenticated()){
        return res.redirect('/')
    }
    next()
}

exports.isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/')
}