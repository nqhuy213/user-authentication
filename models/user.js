const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

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
    isActive:{
        type: Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default: Date()
    },
    verifyString: String
    },
    {
        versionKey: false
    }
)

module.exports = mongoose.model('users', userSchema)
module.exports.hashPassword = async (password) => {
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
}
