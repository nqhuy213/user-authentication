const passport = require('passport')
const Users = require('../models/user')

passport.serializeUser((user,done) => {
    done(null, user._id)
})

passport.deserializeUser((idFromCookie, done) => {
    Users.findById(idFromCookie).then((user)=>{
        done(null,user)
    })
    .catch((err) => done(err))
})

module.exports = passport