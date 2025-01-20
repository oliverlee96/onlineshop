//check if user is logged in
function checkAuthStatus(req, res, next) {
    const uid = req.session.uid;

    if (!uid) { // check if there is existing user id
        return next();
    }
    //checking the session for user id, if theyre authenticated and if they are an admin
    res.locals.uid = uid;
    res.locals.isAuth = true; // set to confirm the user is authenticated
    res.locals.isAdmin = req.session.isAdmin;
    next();
}

module.exports = checkAuthStatus;