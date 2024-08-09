function handleErrors(error, req, res, next) {
    console.log(error);
    res.status(500).render('shared/500'); //renders error page and sets status as 500
}

module.exports = handleErrors;