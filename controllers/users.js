const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');   


module.exports.renderSignup = (req,res)=>{
    res.render('./users/signup');
};
module.exports.createuser = async(req,res,next)=>{
    try{
        let {email,username, password} = req.body;
        const newUser = new User({email, username});
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, err=>{
            if(err) return next(err);
        }); 
        req.flash('success', 'Welcome to Wanderlust');
        res.redirect('/listings');
    }catch(e){
        req.flash('error', e.message);
        res.redirect('/signup');
    }
};
module.exports.renderLogin = (req,res)=>{
    res.render('./users/login');
};
module.exports.logout = (req,res, next)=>{
    req.logout((err)=>{
        if(err) return next(err);
        req.flash('success', "Goodbye!");
        res.redirect('/listings');  
    });

 };
