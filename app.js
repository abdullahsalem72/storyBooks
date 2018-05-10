const express = require("express");
const mongoose = require("mongoose");
const passport = require('passport');

// PASSPORT CONFIG
require('./config/passport')(passport);

// LOAD ROUTES
const auth = require('./routes/auth');

const app = express();

app.get('/', (req, res) => {
    res.send('It works');
});

//SET ROUTES
app.use('/auth', auth);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
