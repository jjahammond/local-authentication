const express = require('express'),
      mongoose = require('mongoose'),
      session = require('express-session'),
      passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      User = require('./models/user.js'),
      bodyParser = require('body-parser');

const app = express();

// Setup MongoDB through mongoose
mongoose.connect("mongodb://localhost/local_auth", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Set middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret: 'kimi raikkonen',
  resave: false,
  saveUninitialized: true
 }));
app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// GET - Index route
app.get("/", isLoggedIn, (req, res) => {
  res.render("index");
});

// GET - Sign up route
app.get("/signup", (req, res) => {
  res.render("signup");
});

// GET - Sign up route
app.get("/login", (req, res) => {
  res.render("login");
});

// POST - Handle Login request
app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

// POST - Handle Sign up request
app.post("/signup", (req, res) => {
  User.register(new User({username: req.body.username}), req.body.password, (err) => {
    if (err) {
      console.log(err);
      res.render("signup");
    } else {
      console.log("User registered");
      res.redirect("/");
    }
  });
});

// GET - Handle logout logic, redirect to Index
app.get("/logout", (req, res) => {
  // Handle logout here
  req.logout();
  console.log("User logged out");
  res.redirect("/");
});

// isLoggedIn middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("User logged in");
    return next();
  }
  res.redirect("/login");
}

// LISTEN - Start server, listen for requests
app.listen(3000, () => {
  console.log("Server running.....")
});
