const express = require("express");
const router = express.Router();
const {
  ensureAuthenticated,
  ensureGuest
} = require("./../helpers/auth_helpers");

//Story index
router.get("/", (req, res) => {
  res.render("stories/index");
});

// ADD Story form
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("stories/add");
});

module.exports = router;
