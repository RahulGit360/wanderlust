const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
const userController = require('../controllers/users');
const { renderSignup, createuser, renderLogin , logout} = userController;

router.get('/signup',renderSignup );

router.post('/signup', wrapAsync(createuser));

router.get('/login', renderLogin);

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

 router.get('/logout',logout );
module.exports = router;