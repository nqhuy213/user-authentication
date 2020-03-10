const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const Users = require('../models/user');

const localStrategy = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
    }, async (req, email, password, done) => {
        Users.findOne({email:email}, (err, user) => {

            if(err) return done(err)
            if(!user){
                return done(null, false, {message: "Couldn't find the email address"})
            } 
            if(!user.comparePassword(password)) {
                return done(null, false, {message: "Incorrect password"})
            } 
            
            return done(null, user)
        })
    })
module.exports = localStrategy
