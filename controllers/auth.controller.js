const User = require('../models/user.model');
const authUtil = require('../util/authentication');

function getSignup(req, res) {
    res.render('customer/auth/signup');
}

async function signup(req, res, next) {
    const user = new User( //retrieves form input data from signup page
        req.body.email, 
        req.body.password, 
        req.body.fullname, 
        req.body.address, 
        req.body.city, 
        req.body.postcode
    );

    try {
        await user.signup();
    } catch (error) {
        next(error)
        return;
    }

    res.redirect('/login'); //once a signup is complete the user is redirected to the login page
}

function getLogin(req, res) {
    res.render('customer/auth/login')
}

async function login(req, res, next) {
    const user = new User(req.body.email, req.body.password); // log user in
    let existingUser;
    try {
        existingUser = await user.getUserWithSameEmail();
    } catch (error) {
        next(error);
        return;
    }

    if (!existingUser) {
        res.redirect('/login');
        return;
    }

    const passwordIsCorrect = await user.checkPassword(existingUser.password);

    if (!passwordIsCorrect) {
        res.redirect('/login');
        return;
    }

    authUtil.createUserSession(req, existingUser, function() {
        res.redirect('/');
    });
}

function logout(req, res) {
    authUtil.destroyUserAuthSession(req);
    res.redirect('/login');
}

module.exports = {
    getSignup: getSignup,
    getLogin: getLogin,
    signup: signup,
    login: login,
    logout: logout
};