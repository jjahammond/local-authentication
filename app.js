const express = require('express'),
      bodyParser = require('body-parser');

const app = express();

// Set middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/login", (req, res) => {
  res.send("Handle Login POST request");
});

app.post("/signup", (req, res) => {
  res.send("Handle Sign Up POST request");
});

app.listen(3000, () => {
  console.log("Server running.....")
});
