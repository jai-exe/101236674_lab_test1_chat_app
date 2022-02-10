require("dotenv").config()
// Importing Dependencies
let mongoose = require('mongoose');
let app = require('express')();
let http = require('http').createServer(app);
let passport = require('passport');
let bodyParser = require('body-parser');
let LocalStrategy = require('passport-local');
let passportLocalMongoose = require('passport-local-mongoose');
let io = require('socket.io')(http);
let cors = require('cors');


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
    res.render("main", {username: req.user.username, firstname: req.user.firstname});
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
                    res.render("login");
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

app.get("/room", isLoggedIn, (req, res) => {
    res.render("room");
});


// Socket and Chat
io.on("connection", (socket) => {

    socket.on("joinRoom", ({username, room}) => {
        const UserX = userJoin(socket.id, username, room);
        socket.join(UserX.room);
        let joinMessage = `${UserX.username} has joined the chat!`

        io.to(UserX.room).emit("message", formatMessage("Room", joinMessage));
        io.to(UserX.room).emit("roomUsers", {
            room: UserX.room,
            users: getRoomUsers(UserX.room)
        })

        let chat = new GroupMessage({ from_user: "Room", room: UserX.room, message: joinMessage})
        chat.save();
    })

    socket.on("chatMessage", (msg)=>{
        const UserX = getCurrentUser(socket.id);
        io.to(UserX.room).emit("message", formatMessage(UserX.username, msg));

        let chat = new GroupMessage({ from_user: UserX.username, room: UserX.room, message: msg})
        chat.save();
    })

    socket.on("disconnect", () => {
        const UserX = userLeave(socket.id);
        let msg = `${UserX.username} has left the chat! Sad to see you go...`;
        io.to(User.room).emit("message", formatMessage("Room", msg));
        io.to(UserX.room).emit("roomUsers", {
            room: UserX.room,
            users: getRoomUsers(UserX.room)
        })
        let chat = new GroupMessage({ from_user: "Room", room: UserX.room, message: msg})
        chat.save();
    })
})


// Functions
const moment = require('moment')

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}

function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment.format("h:mm a")
    }
}

const users = [];

function userJoin(id, username, room) { const User = { id, username, room }; users.push(User);
    return User;
}

function getCurrentUser(id) { 
    return users.find((User) => User.id === id); 
}

function userLeave(id) {
    const index = users.findIndex((User) => User.id === id); if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

function getRoomUsers(room) {
    return users.filter((User) => User.room === room);
}


let port = process.env.PORT || 3000;

http.listen(port, () => {
    console.log(`Server running at port ${port}...`);
})

