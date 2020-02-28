const express = require('express')
const router = express.Router()

router.get('/',checkAuthenticated, (req, res )=> {
    console.log(req.user)
    res.render('index', {user: req.user})
})

function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('users/login')
}

function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return res.redirect('/')
    }
    next()
}

module.exports = router