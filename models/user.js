const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const Token = require('./token')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    isVerified:{
        type: Boolean,
        default:false
    },
    verifyString: String
    },
    {timestamps:true},
    {
        versionKey: false
    }
)


userSchema.pre('save', function(next) {
    const user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
})

userSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password,this.password)
}

userSchema.methods.generateVerificationToken = function(){
    let payload = {
        userId: this._id,
        token: crypto.randomBytes(20).toString('hex')
    }
    return new Token(payload)
}

module.exports = mongoose.model('users', userSchema)
