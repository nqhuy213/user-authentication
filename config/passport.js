const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initiallize(passport, getUserByEmail, getUserByUsername) {
    const authenticateUser = async (email, password, done) =>{
        const user = await getUserByEmail(email)
        if(user == null){
            return done(null, false, { message: "Couldn't find the email"})
        }
        try{
            if (await bcrypt.compare(password, user.password)){
                console.log('Login successful')
                return done(null,user)
            }else{
                return done(null, false, {message: "Password incorrect"})
            }
        }catch(err){
            return done(err)
        }
    } 

    passport.use( new LocalStrategy({usernameField: 'email'}, authenticateUser ))
    passport.serializeUser((user,done) => done(null,user.username))
    passport.deserializeUser(async (username,done) => {
        return done(null, await getUserByUsername(username))
    })

}

module.exports = initiallize