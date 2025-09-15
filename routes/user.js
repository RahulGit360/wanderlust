const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');

router.get('/signup', (req,res)=>{
    res.render('./users/signup');
});

router.post('/signup', wrapAsync(async(req,res,next)=>{
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
}));

router.get('/login', (req,res)=>{
    res.render('./users/login');
});

router.post('/login', saveRedirectUrl, 
    passport.authenticate("local",{
        failureFlash: true,
        failureRedirect: '/login',
    }),
    async(req,res)=>{
        req.flash('success', 'Welcome back!');
        res.redirect(req.session.returnTo || '/listings');
        delete req.session.returnTo;
 });

 router.get('/logout', (req,res, next)=>{
    req.logout((err)=>{
        if(err) return next(err);
        req.flash('success', "Goodbye!");
        res.redirect('/listings');  
    });

 })
module.exports = router;