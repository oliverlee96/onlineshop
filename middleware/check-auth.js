//check if user is logged in
function checkAuthStatus(req, res, next) {
    const uid = req.session.uid;

    if (!uid) {
        return next();
    }

    res.locals.uid = uid;
    res.locals.isAuth = true; // set to confirm the user is authenticated
    next();
}

module.exports = checkAuthStatus;