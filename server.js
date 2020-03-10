if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}


const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const bodyParser = require('body-parser')



//--- 1 - SET UP VIEW ENGINE
app.set('view engine',  'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layout')
app.use(expressLayouts)
app.use(bodyParser.urlencoded({extended: false}))



//--- 2 - SET UP DATABASE
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect(process.env.DATABASE_URI, {useNewUrlParser:true})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

//--- 3 SET UP PASSPORT
const session = require('express-session')
const passport = require('./config/passport-config')
const passportStrategySetup = require('./config/passport-local-strategy')
const flash = require('connect-flash')

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
//  How is the user being authenticated during login
passport.use(passportStrategySetup)

//  Creates Passport's methods and properties on `req` for use in out routes
app.use(passport.initialize())
//  Set passport to manage user sessiong
app.use(passport.session())
//  Allow flash message for router
app.use(flash())

//--- 4 - SET UP ROUTERS
const usersRouter = require('./routes/users-router')
const indexRouter = require('./routes/index')
const verifyRouter = require('./routes/verify-router')
const activateRouter = require('./routes/activate-router')

app.use('/users', usersRouter)
app.use('/verify', verifyRouter)
app.use('/', indexRouter)
app.use('/activate', activateRouter)



//--- 5 - SET UP PORT
app.listen(process.env.PORT || 3000)