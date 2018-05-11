const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const path = require("path");
const flash = require("connect-flash");

// LOAD USER MODEL
require("./models/User");

// PASSPORT CONFIG
require("./config/passport")(passport);

// LOAD ROUTES
const index = require("./routes/index");
const auth = require("./routes/auth");
const stories = require("./routes/stories");

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

// PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
// SET GLOBAL VARIABLES (AFTER PASSPORT MIDDLEWARE)
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

// Set Static folder
app.use(express.static(path.join(__dirname, "public")));

//SET ROUTES
app.use("/", index);
app.use("/auth", auth);
app.use("/stories", stories);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
