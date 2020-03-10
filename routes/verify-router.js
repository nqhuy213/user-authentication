const express = require('express')
const router = express.Router()
const Users = require('../models/user')
const registerValidate = require('../middleware/register-validate')
const loginValidate = require('../middleware/login-validate')
const Auth = require('../controllers/user-controller')
const emailVerification = require('../controllers/email-controller')

router.get('/:id', emailVerification.isNotVerified, emailVerification.sendEmail)

module.exports = router