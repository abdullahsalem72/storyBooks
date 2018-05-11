const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");

// LOAD USER MODEL
require("./models/User");

// PASSPORT CONFIG
require("./config/passport")(passport);

// LOAD ROUTES
const auth = require("./routes/auth");
const index = require("./routes/index");

// LOAD KEYS
const keys = require("./config/keys");

// MONGOOSE CONNECT
mongoose
  .connect(keys.mongoURI)
  .then(() => console.log("MongoDb Connected"))
  .catch(err => console.error(err));

const app = express();

// EXPRESS-HANDLEBARS MIDDLEWARE SETUP
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// COOKIE PARSER MIDDLEWARE
app.use(cookieParser());

// EXPRESS SESSION MIDDLEWARE
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
  })
);

// SET GLOBAL VARIABLES
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());

//SET ROUTES
app.use("/auth", auth);
app.use("/", index);


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
