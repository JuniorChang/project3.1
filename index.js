const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const cors = require ('cors');
require("dotenv").config();
var jwt = require('jsonwebtoken');  //generate a access token so all other end points can be secure.
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);
const csurf = require('csurf');

const {
    User
} = require('./models');

// create an instance of express app
let app = express();
app.use(cors());
// app.use(express.json());

// static folder
app.use(express.static("public"));
// app.use(express.static(publicDirectoryPath));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// enable forms
app.use(
    express.urlencoded({
        extended: false
    })
);


// set the view engine
app.set("view engine", "hbs");

// setting up sessions
app.use(session({
    'store': new FileStore(),
    'secret': process.env.SESSION_SECRET_KEY,
    'resave': false,
    'saveUninitialized': true
}));

app.use(flash())
app.use(function (req, res, next){
    res.locals.success_messages = req.flash("success_messages");
    res.locals.error_messages = req.flash("error_messages");
    next();
});

// enable CSRF, then share CSRF with hbs files
const csurfIntance = csurf();
app.use(function(req,res,next){
    console.log("chekcing for csrf exclusion")
    if (req.url === "/checkout/process_payment"){
        return next();
    }
    csurfIntance(req,res,next);
})

// global middleware
app.use(function(req,res,next){
    if (req.csrfToken) {
        res.locals.csrfToken = req.csrfToken();
    }
    next();
})


// sharing user data with the hbs files
app.use(function(req,res,next){
    res.locals.user = req.session.user;
    next();
});

app.options('*', cors())

// import in routes
const landingRoutes = require('./routes/landing');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const cloudinaryRoutes = require('./routes/cloudinary.js');
const cartRoutes = require('./routes/shoppingCart.js');
const checkoutRoutes = require('./routes/checkout');
const ownerRoutes = require('./routes/owner');

const api = {
    'products': require('./routes/products'),
    'users': require('./routes/users')
}
let verifyToken = async (req, res, next) => {
    console.log(req.session)

  if (typeof( req.session.user)== 'undefined' || ! req.session.user ) {
       res.redirect('/users/login')
  }
  try {
    const decoded = jwt.verify( req.session.user.token, process.env.SECRETJWT);

    let user = await User.where({
                'id': decoded.id
            }).fetch({
                require: false
            });

    if(!user) res.redirect('/users/login')
    else next()
   }
  
   catch (err) {
   next();
  }
}

async function main() {
    app.use("/", landingRoutes);
    app.use("/products", productRoutes);
    app.use("/users", userRoutes);
    app.use("/cloudinary", cloudinaryRoutes);
    app.use("/carts",verifyToken, cartRoutes);
    app.use("/checkout",verifyToken, checkoutRoutes);
    app.use("/owner", ownerRoutes);

    // app.use('./api/products', express.json(), api.products);
    // app.use('./api/users', express.json(), api.users);
}




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

