const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//LOAD MODELS
const Story = mongoose.model("stories");

const {
  ensureAuthenticated,
  ensureGuest
} = require("./../helpers/auth_helpers");

router.get("/", ensureGuest, (req, res) => {
  res.render("index/welcome");
});
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  Story.find({
    user: req.user.id
  })
    .populate("user")
    .then(stories => {
      res.render("stories/dashboard", {
        stories: stories
      });
    });
});

router.get("/about", (req, res) => {
  res.render("index/about");
});

module.exports = router;
