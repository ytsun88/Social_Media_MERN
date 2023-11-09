const router = require("express").Router();
const Post = require("../models").postModel;
const User = require("../models").userModel;

router.use((req, res, next) => {
  console.log("A request is coming into post API.");
  next();
});

const asyncConcat = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index]);
  }
};

router.get("/friendsPosts", async (req, res) => {
  let myPosts = await Post.find({ poster: { _id: req.user._id } }).populate(
    "poster",
    ["username", "email"]
  );
  try {
    await asyncConcat(req.user.friends, async (_friend_id) => {
      const data = await Post.find({ poster: { _id: _friend_id } }).populate(
        "poster",
        ["username", "email"]
      );
      myPosts = myPosts.concat(data);
    });
    res.send(myPosts);
  } catch (err) {
    res.status(500).send("Cannot get your posts.");
  }
});

router.get("/friendsPosts/:_user_id", async (req, res) => {
  let { _user_id } = req.params;
  let posts = await Post.find({ poster: { _id: _user_id } })
    .populate("poster", ["username"])
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send("Cannot get your posts.");
    });
});

router.get("/myPosts/:_user_id", async (req, res) => {
  let { _user_id } = req.params;
  let myPosts = await Post.find({ poster: { _id: _user_id } })
    .populate("poster", ["username"])
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send("Cannot get your posts.");
    });
});

const asyncPush = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index]);
  }
};

router.get("/like/:_post_id", async (req, res) => {
  let { _post_id } = req.params;
  let likeList = [];
  await Post.findOne({ _id: _post_id })
    .then(async (response) => {
      try {
        await asyncPush(response.like, async (likerID) => {
          const user = await User.findOne({ _id: likerID });
          likeList.push(user);
        });
        res.send(likeList);
      } catch (err) {
        res.status(500).send(err);
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.get("/comment/:_post_id", async (req, res) => {
  let { _post_id } = req.params;
  await Post.findOne({ _id: _post_id })
    .then((response) => {
      res.send(response.comment);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.get("/:_post_id", async (req, res) => {
  let { _post_id } = req.params;
  let foundPost = await Post.findOne({ _id: _post_id })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Cannot get the post.");
    });
});

router.post("/", async (req, res) => {
  const newPost = new Post({
    title: req.body.title,
    content: req.body.content,
    poster: req.user,
  });
  try {
    const savedPost = await newPost.save();
    res.status(200).send({
      msg: "Success.",
      savedObj: savedPost,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send("Error! Post not saved.");
  }
});

router.post("/likePost/:_post_id", async (req, res) => {
  let { _post_id } = req.params;
  try {
    let post = await Post.findOne({ _id: _post_id });
    for (let i = 0; i < post.like.length; i++) {
      if (post.like[i] == req.user._id) {
        post.like.splice(i, 1);
        await post.save();
        return res.status(200).send(false);
      }
    }
    post.like.push(req.user._id);
    await post.save();
    res.status(200).send(true);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/commentPost/:_post_id", async (req, res) => {
  let { _post_id } = req.params;
  let { content } = req.body;
  let newComment = {
    commenterID: req.user._id,
    commenterName: req.user.username,
    content: content,
  };
  let post = await Post.findOne({ _id: _post_id });
  if (post) {
    post.comment.push(newComment);
    await post
      .save()
      .then(() => {
        res.status(200).send("Comment successfully.");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Comment failed.");
      });
  } else {
    res.status(404).send("Cannot find the post.");
  }
});

router.put("/myPosts/edit/:_post_id", async (req, res) => {
  let { _post_id } = req.params;
  let { title, content } = req.body;
  let foundPost = await Post.findOne({ _id: _post_id });
  if (foundPost) {
    if (foundPost.poster._id.equals(req.user._id)) {
      Post.findOneAndUpdate({ _id: _post_id }, { title, content })
        .then(() => {
          res.send("Post updated.");
        })
        .catch((err) => {
          res.send(err);
        });
    } else {
      res.status(403).send("Only the poster can edit the post.");
    }
  } else {
    res.status(404).send("Post not found.");
  }
});

router.delete("/myPosts/delete/:_post_id", async (req, res) => {
  let { _post_id } = req.params;
  let foundPost = await Post.findOne({ _id: _post_id });
  if (foundPost) {
    if (foundPost.poster._id.equals(req.user._id)) {
      Post.deleteOne({ _id: _post_id })
        .then(() => {
          res.send("Post deleted.");
        })
        .catch((err) => {
          res.send(err);
        });
    } else {
      res.status(403).send("Only the poster can delete the post.");
    }
  } else {
    res.status(404).send("Post not found.");
  }
});

module.exports = router;
