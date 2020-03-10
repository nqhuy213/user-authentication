const Users = require('../models/user')
const Token = require('../models/token')
const {sendEmail} = require('../utils/sendgrid')

// 
exports.sendEmail = async (req,res) => {
    const user = req.user
    if(await Token.findOne({userId: user._id})){
        return res.render('verify/verify')
    }
    await sendVerificationEmail(user,req,res)
    return res.render('verify/verify')
}

//ACTIVATE ACCOUNT
exports.activate = async (req,res, next) => {
    if(!req.params.token) return res.send('Cannot find the user for this token.')
    try {
        const token = await Token.findOne({token: req.params.token})
        if(!token) return res.send('Cannot find the valid token, the token might have expired.')
        //If we found a token
        Users.findOne({_id: token.userId}, (err, user) => {
            if(!user) return res.send('Cannot find user for this token.')
            if(user.isVerified) return res.send('This user has already been verified.')

            user.isVerified = true
            user.save((err) => {
                if(err) return res.send(err.message)
                req.user = user
                next()
            })
        })

    } catch (error) {
        console.log(error)
    }
}

exports.isNotVerified = async (req,res,next) => {
    const user = await Users.findById(req.params.id)
    if(!user.isVerified){
        req.user = user
        return next()
    }
    ///When it is already verified
    return res.send("something wrong")
}


async function sendVerificationEmail(user, req,res) {
    try{
        const token = user.generateVerificationToken()
        await token.save()
        let link = "http://" + req.headers.host + "/activate/" + token.token // When deploy server, we need "https://" at the beginning
        let html = `<p>Hi ${user.name},<p><br><p>Please click on the following <a href="${link}">link</a> to verify your account.</p> 
                  <br><p>If you did not request this, please ignore this email.</p>`;
        const msg = {
            to: user.email,
            from: process.env.FROM_MAIL,
            subject: 'Email Verification',
            html: html
        }
        await sendEmail(msg)
        
    }catch(err){
        console.log(err)
    }
}