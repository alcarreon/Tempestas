const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("express-flash");
const logger = require("morgan");
const connectDB = require("./config/database");
const mainRoutes = require("./routes/main");
const todoRoutes = require("./routes/locations");

require("dotenv").config({ path: "./config/.env" });

// Passport config
require("./config/passport")(passport);

connectDB();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger("dev"));
// Sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use("/", mainRoutes);
app.use("/location", todoRoutes);

app.post("/getForcast", async (req, res) => {
  // req.body. allows me to pick which specific part of the form data i want to use
  // console.log(req.body.date);
  //should give a  15 day forecast based on the zip entered
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${zipLocation}?key=${API_KEY}`;

  // use fetch just like you would in regular js
  let response = await fetch(url);
  let data = await response.json();

  console.log(data);

  // pictureCollection
  //   .insertMany(data)
  //   .then((result) => res.redirect("/"))
  //   .catch((error) => console.error(error));
});

app.listen(process.env.PORT, () => {
  console.log("Server is running, you better catch it!");
});
