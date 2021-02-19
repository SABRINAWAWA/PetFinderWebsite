// Connected to Express and Router
const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');

// Import database Schema
const User = require('../models/user');

router.get('/register', (req, res) => {
    res.render('user/register');
});

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { password } = req.body;
        const user = new User(req.body.user);
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to petfinder!');
            res.redirect('/petfinder');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

router.get('/login', (req, res) => {
    res.render('user/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/petfinder';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/petfinder');
})

router.get('/userprofile', isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('shelter').populate('lostPet').populate({ path: 'petadoption', populate: { path: 'customer', populate:{path:'author'}}});
        if (!user) {
            req.flash('error', 'User Cannot Find!')
            return redirect(`/`);
        }
        console.log(user);
        res.render('user/show', { user });
    } catch (e) {
        req.flash('error', e.message);
        return res.redirect('/petfinder');
    }
});

module.exports = router;
