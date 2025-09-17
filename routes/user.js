const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
const userController = require('../controllers/users');
const { renderSignup, createuser, renderLogin , logout} = userController;

router.route('/signup')
    .get(renderSignup )
    .post(wrapAsync(createuser));

    
router.route('/login')
    .get(renderLogin)
    .post(saveRedirectUrl, 
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