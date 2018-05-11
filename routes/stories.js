const express = require("express");
const router = express.Router();

//Story index
router.get("/", (req, res) => {
  res.render("stories/index");
});

// ADD Story form
router.get("/add", (req, res) => {
  res.render("stories/add");
});

module.exports = router;
