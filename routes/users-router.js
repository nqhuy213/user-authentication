const express = require('express')
const router = express.Router()
const Users = require('../models/user')
const registerValidate = require('../middleware/register-validate')
const loginValidate = require('../middleware/login-validate')
const Auth = require('../controllers/user-controller')

//Route Register
router.route('/register')
    .get(Auth.isNotAuthenticated,(req,res) => {
        res.render('users/register')
    })
    .post(registerValidate, Auth.register, Auth.verify, Auth.login)

//Route Login
router.route('/login')
    .get(Auth.isNotAuthenticated,(req,res) => {
        res.render('users/login', {message: req.flash('error')})
    })
    .post(loginValidate,Auth.verify, Auth.login)


//Route Logout
router.post('/logout', Auth.logout)




module.exports = router