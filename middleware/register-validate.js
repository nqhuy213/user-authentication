module.exports = (req,res,next)=> {
    const {name , email, password, passwordConfirm} = req.body
    let errors = []
    //Check required fields
    if(!name || !email || !password || !passwordConfirm){
        errors.push({msg: 'Please fill in all fields.'})
    }else{
            //Check password match
        if(passwordConfirm != password){
            errors.push({msg: 'Password do not match.'})
        }
        //Check password length
        if(password.length < 6){
            errors.push({ msg: 'Password must be at least 6 characters.'})
        }
    }
    //Handle Errors
    if(errors.length > 0){
        return res.render('users/register', {
            errors,
            name,
            email,
            password
        })
    }else{
        next()
    }
    
}
