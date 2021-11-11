const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);
const csrf = require('csurf');


require("dotenv").config();

// create an instance of express app
let app = express();

app.use(express.static(__dirname + '/public'));

// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// enable forms
app.use(
    express.urlencoded({
        extended: false
    })
);

// setting up sessions
app.use(session({
    store: new FileStore(),
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true
}));

app.use(flash())
app.use(function (req, res, next){
    res.locals.success_messages = req.flash("success_messages");
    res.locals.error_messages = req.flash("error_messages");
    next();
});

// sharing user data with the hbs files
app.use(function(req,res,next){
    res.locals.user = req.session.user;
    next();
});

// import in routes
const landingRoutes = require('./routes/landing');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const cloudinaryRoutes = require('./routes/cloudinary.js');
const cartRoutes = require('./routes/shoppingCart.js');
const checkoutRoutes = require('./routes/checkout');

async function main() {
    app.use("/", landingRoutes);
    app.use("/products", productRoutes);
    app.use("/users", userRoutes);
    app.use("/cloudinary", cloudinaryRoutes);
    app.use("/cart", cartRoutes);
    app.use('/checkout', checkoutRoutes);
}

// enable CSRF, then share CSRF with hbs files
app.use(csrf());

app.use(function(req,res,next){
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use(function (err, req,res,next) {
    if (err && err.code == "EBADCSRFTOKEN") {
        req.flash("error_messages", "The form has expired. Please reload");
        res.redirect('back');
    }else {
        next()
    }
});




main();

app.listen(3000, () => {
    console.log("Server has started");
});