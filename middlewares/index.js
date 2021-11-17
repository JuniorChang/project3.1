const checkIfAuthenticated = (req,res, next) => {
    if (req.session.user) {
        next()
    } else {
        req.flash("error_messages", "Log in to view this page");
        res.redirect('/users/login');
    }
};

const checkIfOwner = (req,res, next) => {
    if (req.session.owner) {
        next()
    } else {
        req.flash("error_messages", "You are not authorised to view this page");
        res.redirect('/users/login');
    }
};

module.exports = {
    checkIfAuthenticated,
    checkIfOwner
}