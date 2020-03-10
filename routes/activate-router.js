const express = require('express')
const router = express.Router()
const emailVerification = require('../controllers/email-controller')
const Auth = require('../controllers/user-controller')
const passport = require('passport')


router.get('/:token', emailVerification.activate, (req, res) => {
  req.login(req.user, (err) => {
    if(!err){
      req.verifySuccess = "Meo"
      return res.redirect('/')
    }
    else{
      console.log(err)
    }
  })
  
})

module.exports = router