const User = require('../models/user.model');

function getSignup(req, res) {
    res.render('customer/auth/signup');
}

async function signup(req, res) {
    const user = new User( //retrieves form input data from signup page
        req.body.email, 
        req.body.password, 
        req.body.fullname, 
        req.body.address, 
        req.body.city, 
        req.body.postcode
    );

    await user.signup();

    res.redirect('/login'); //once a signup is complete the user is redirected to the login page
}

function getLogin(req, res) {
    res.render('customer/auth/login')
}

module.exports = {
    getSignup: getSignup,
    getLogin: getLogin,
    signup: signup
};