const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const {
  ensureAuthenticated,
  ensureGuest
} = require("./../helpers/auth_helpers");

// LOAD Models
const Story = mongoose.model("stories");
const User = mongoose.model("users");

//Story index
router.get("/", (req, res) => {
  Story.find({ status: "public" })
    .populate("user")
    .sort({ date: "desc" })
    .then(stories => {
      res.render("stories/index", {
        stories: stories
      });
    });
});

//SHOW SINGLE STORY
router.get("/show/:id", (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
    .populate("user")
    .populate("comments.commentUser")
    .then(story => {
      if (story.status == "private") {
        if (req.user) {
          if (req.user.id == story.user.id) {
            res.render("stories/show", {
              story: story
            });
          } else {
            res.redirect("/stories");
          }
        } else {
            res.redirect("/stories");
        }
      } else {
        res.render("stories/show", {
          story: story
        });
      }
    });
});

//LIST USER'S STORIES
router.get("/user/:userId", (req, res) => {
  //let visibility = req.params.userId == req.user.id ? "" : "public";
  const query = req.user
    ? req.user.id == req.params.userId
      ? {
          user: req.params.userId
        }
      : {
          user: req.params.userId,
          status: "public"
        }
    : {
        user: req.params.userId,
        status: "public"
      };
  console.log(query);
  Story.find(query)
    .populate("user")
    .then(stories => {
      res.render("stories/index", {
        stories: stories
      });
    })

    .catch(err => console.error(err));
});

// ADD Story form
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("stories/add");
});

// PROCESS ADD STORIES
router.post("/", (req, res) => {
  const { body } = req;
  //Checks

  //Save Story
  const newStory = {
    title: body.title,
    status: body.status,
    allowComments: !!body.allowComments,
    // Note: allowComments comes either on or nothing if its off
    body: body.body,
    user: req.user.id
  };
  new Story(newStory).save().then(story => {
    res.redirect(`/stories/show/${story.id}`);
  });
});

// SHOW EDIT STORY
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Story.findOne({
    _id: req.params.id
  }).then(story => {
    console.log(story);
    /*console.log(typeof story.user.id);
      console.log(typeof req.user.id);
      console.log(story.user === req.user.id);*/
    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      res.render("stories/edit", {
        story: story
      });
    }
  });
});

// SAVE EDIT
router.put("/:id", (req, res) => {
  Story.findOne({
    _id: req.params.id
  }).then(story => {
    //const { title, status, allowComments, body } = ({req.body});
    //story["title", "status", "allowComments", "body"] = {req};
    const { body } = req;
    story.title = body.title;
    story.status = body.status;
    story.allowComments = !!body.allowComments;
    story.body = body.body;
    story.save().then(story => {
      res.redirect("/dashboard");
    });
  });
});
//DELETE STORY
router.delete("/:id", (req, res) => {
  Story.remove({
    _id: req.params.id
  }).then(() => {
    res.redirect("/dashboard");
  });
});

//ADD COMMENT
router.post("/comment/:id", (req, res) => {
  Story.findOne({
    _id: req.params.id
  }).then(story => {
    const newComment = {
      commentBody: req.body.commentBody,
      commentUser: req.user.id
    };
    //add comment
    story.comments.unshift(newComment);
    story.save().then(story => {
      res.redirect(`/stories/show/${story.id}`);
    });
  });
});

module.exports = router;
