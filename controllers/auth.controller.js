const User = require('../models/user.model');
const authUtil = require('../util/authentication');
const validation = require('../util/validation');
const sessionFlash = require('../util/session-flash');

function getSignup(req, res) {
    let sessionData = sessionFlash.getSessionData(req);

    if (!sessionData) {
        sessionData = {
            email: '',
            confirmEmail: '',
            password: '',
            fullname: '',
            address: '',
            city: '',
            postcode: ''
        };
    }

    res.render('customer/auth/signup', { inputData: sessionData });
}

async function signup(req, res, next) {

    const enteredData = {
        email: req.body.email,
        confirmEmail: req.body['confirm-email'],
        password: req.body.password, 
        fullname: req.body.fullname, 
        address: req.body.address, 
        city: req.body.city, 
        postcode: req.body.postcode
    }

    if (!validation.userDetailsAreValid(
        req.body.email, 
        req.body.password, 
        req.body.fullname, 
        req.body.address, 
        req.body.city, 
        req.body.postcode) || !validation.emailsMatch(req.body.email, req.body['confirm-email'])
    ) { //adding saved session data before redirect
        sessionFlash.flashDataToSession(req, {
            errorMessage: 'Please check your details are correct (Passwords must be over 5 chars).',
            ...enteredData
        }, 
        function() {
            res.redirect('/signup'); //if user enters invalid signup details they're redirected to signup page
        }
    );
    return;
    }

    const user = new User( //retrieves form input data from signup page
        req.body.email, 
        req.body.password, 
        req.body.fullname, 
        req.body.address, 
        req.body.city, 
        req.body.postcode
    );

    try {
        const existsAlready = await user.existsAlready();

        if (existsAlready) {
            sessionFlash.flashDataToSession(req, {
                errorMessage: 'User exists already, please log in.',
                ...enteredData
            }, function() {
                res.redirect('/signup');
            })
            return;
        }
        await user.signup();
    } catch (error) {
        next(error);
        return;
    }

    res.redirect('/login'); //once a signup is complete the user is redirected to the login page
}

function getLogin(req, res) {
    let sessionData = sessionFlash.getSessionData(req);

    if (!sessionData) {
        sessionData = {
            email: '',
            password: ''
        };
    }
    res.render('customer/auth/login', { inputData: sessionData })
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

    const sessionErrorData = {
        errorMessage: 'Please check your email or password.',
        email: user.email,
        password: user.password
    };

    if (!existingUser) {
        sessionFlash.flashDataToSession(req, sessionErrorData, function() {
            res.redirect('/login');
        })
        return;
    }

    const passwordIsCorrect = await user.checkPassword(existingUser.password);

    if (!passwordIsCorrect) {
        sessionFlash.flashDataToSession(req, sessionErrorData, function() {
            res.redirect('/login');
        });
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