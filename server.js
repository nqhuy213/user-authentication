if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}


const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const Users = require('./models/user')
const flash = require('express-flash')
const methodOverride = require('method-override')


const initializePassport = require('./config/passport')
initializePassport(passport, 
    async email => await Users.findOne({email:email}),
    async username => await Users.findOne({username:username})
    
)
//Passport Config


app.set('view engine',  'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layout')
app.use(expressLayouts)
app.use(bodyParser.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

//Set up Mongoose
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect(process.env.DATABASE_URI, {useNewUrlParser:true})
const db = mongoose.connection

db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

//Set up routers
const usersRouter = require('./routes/users')
const indexRouter = require('./routes/index')

app.use('/users', usersRouter)
app.use('/', indexRouter)

app.use(bodyParser.urlencoded({extended: false}))

//Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))

//Passport Middleware


//Connect Flash
app.use(flash())

//Global variables


app.listen(process.env.PORT || 3000)