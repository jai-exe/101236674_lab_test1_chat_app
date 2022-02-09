// Importing Dependencies
let mongoose = require('mongoose');
let app = require('express')();
let passport = require('passport');
let bodyParser = require('body-parser');
let LocalStrategy = require('passport-local');
let passportLocalMongoose = require('passport-local-mongoose');
let io = require('socket.io');

// Using Mongoose to connect to MongoDB
const uri = "mongodb+srv://gbc:s3cr3t@cluster0.dhvqi.mongodb.net/labtest1_comp3133_101236674?retryWrites=true&w=majority";
mongoose.connect(uri);

// Getting the path of current directory
let { dirname } = require('path');

// Importing the models
let User = require('./models/User');
let GroupMessage = require('./models/GroupMessage');

// Configuring the app dependecy which is express()
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require("express-session")({
    secret: "Valar Morghulis",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Setting up Passport
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
app.get("/", (req, res) => {
    res.render("home");
});

app.get("/home", isLoggedIn, (req, res) => {
    res.render("main", {username: req.user.username});
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    let username = req.body.username
    let password = req.body.password
    let firstname = req.body.firstname
    let lastname = req.body.lastname
    User.register(new User({username: username, firstname: firstname, lastname: lastname}),
        password, (err, user) => {
            if(err){
                console.log(err);
                return res.render("register");
            }
            else{
                passport.authenticate("local")(req, res, () => {
                    res.render("main");
                });
            }
        }
    );
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login"
}), (req, res) => {    
});

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}

let port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running at port ${port}...`);
})

