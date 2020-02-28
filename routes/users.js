const express = require('express')
const router = express.Router()
const Users = require('../models/user')
const passport = require('passport')
const methodOverride = require('method-override')
//Route Register
router.route('/register')
    .get(checkNotAuthenticated,(req,res) => {
        res.render('users/register')
    })
    .post( checkNotAuthenticated,async (req,res) => {
        const {name , email, password, passwordConfirm} = req.body
        let errors = []
        //Check required fields
        if(!name || !email || !password || !passwordConfirm){
            errors.push({msg: 'Please fill in all fields.'})
        }
        //Check password match
        if(passwordConfirm != password){
            errors.push({msg: 'Password do not match.'})
        }
        //Check password length
        if(password.length < 6){
            errors.push({ msg: 'Password must be at least 6 characters.'})
        }
        
        //Handle Errors
        if(errors.length > 0){
            res.render('users/register', {
                errors,
                name,
                email,
                password
            })
        }else{
            //Check Email Existence
            let isUsed = await Users.find({email:email})
            if(isUsed.length > 0){
            errors.push({ msg: 'Email has already been used.'})
            res.render('users/register', {
                errors,
                name,
                email,
                password,
                passwordConfirm
            })
            //When everything is fine
            }else{
                try {
                    hashedPassword = await Users.hashPassword(password)
                    var newUserData = {
                        name: name,
                        email: email,
                        password: hashedPassword,
                        username: email.split('@')[0]
                    }
                    var newUser = new Users(newUserData)
                    newUser.save()
                    res.render('users/login')
                }catch(err){    
                    console.log(err)
                }
            }
            
        }

    })

//Route Login
router.route('/login')
    .get(checkNotAuthenticated,(req,res) => {
        res.render('users/login')
    })
    .post(checkNotAuthenticated,passport.authenticate('local',{
        successRedirect: '/',
        failureRedirect: './login',
        failureFlash: true,
        
}))

//Route Logout
router.delete('/logout', (req,res) => {
    req.logOut()
    res.redirect('./login')
})

function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
       return res.redirect('/')
    }
    next()
}

//Route Profile


module.exports = router