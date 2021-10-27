const checkIfAuthenticated = (req,res, next) => {
    if (req.session.user) {
        next()
    } else {
        req.flash("error_messages", "Log in to view this page");
        res.redirect('/users/login');
    }
};

module.exports = {
    checkIfAuthenticated
}