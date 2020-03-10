module.exports = (req,res,next)=> {
    const {email, password} = req.body
    let errors = []
    //Check required fields
    if(!email || !password){
        errors.push({msg: 'Please enter email and password'})
    }
    //Handle Errors
    if(errors.length > 0){
        res.render('users/login', {
            errors,
            email,
            message: req.flash('error')
        })
    }
    next()
}
