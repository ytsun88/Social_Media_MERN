const router = require("express").Router();
const User = require("../models").userModel;

router.use((req, res, next) => {
  console.log("A request is coming into friend API.");
  next();
});

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index]);
  }
};

router.get("/checkCurrentUser", async (req, res) => {
  try {
    let currentUser = await User.findOne({ _id: req.user._id });
    res.send(currentUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/myFriends", async (req, res) => {
  let friendsList = [];

  try {
    await asyncForEach(req.user.friends, async (_friend_id) => {
      const data = await User.findOne({ _id: _friend_id });
      friendsList.push(data);
    });

    res.send(friendsList);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/findByName/:name", (req, res) => {
  let { name } = req.params;
  User.find({ username: name })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.get("/findByKey/:key", (req, res) => {
  let { key } = req.params;
  User.find({ keywords: key })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.get("/findByID/:_id", (req, res) => {
  let { _id } = req.params;
  User.findOne({ _id })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.post("/sendInvitation/:_friend_id", async (req, res) => {
  let { _friend_id } = req.params;
  await User.findOne({ _id: _friend_id })
    .then(async (foundUser) => {
      let requests = foundUser.requests;
      for (let i = 0; i < requests.length; i++) {
        if (requests[i].sentByID == req.user._id) {
          return res.status(400).send("Invitation has been sent.");
        }
      }
      requests.push({
        _id: req.user._id,
        sentByID: req.user._id,
        sentByName: req.user.username,
      });
      await foundUser.save();
      return res.send("Succeed.");
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.post("/cancelInvitation/:_friend_id", async (req, res) => {
  let { _friend_id } = req.params;
  await User.findOne({ _id: _friend_id })
    .then(async (foundUser) => {
      for (let i = 0; i < foundUser.requests.length; i++) {
        if (foundUser.requests[i].sentByID == req.user._id) {
          foundUser.requests.splice(i, 1);
        }
      }
      await foundUser.save();
      res.send("Invitation deleted.");
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});
router.post("/deleteInvitation/:_friend_id", async (req, res) => {
  let { _friend_id } = req.params;
  for (let i = 0; i < req.user.requests.length; i++) {
    if (req.user.requests[i].sentByID == _friend_id) {
      req.user.requests.splice(i, 1);
    }
  }
  await req.user
    .save()
    .then(() => {
      res.send("Succeed.");
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post("/addFriend/:_friend_id", async (req, res) => {
  let { _friend_id } = req.params;
  if (_friend_id == req.user._id) {
    return res.status(400).send("Cannot add yourself as friend.");
  }
  try {
    let friend = await User.findOne({ _id: _friend_id });
    for (let i = 0; i < friend.friends.length; i++) {
      if (friend.friends[i] == req.user._id) {
        return res.status(400).send("You are already friends.");
      }
    }
    friend.friends.push(req.user._id);
    await friend.save();
    let currentUser = await User.findOne({ _id: req.user._id });
    for (let i = 0; i < currentUser.friends.length; i++) {
      if (currentUser.friends[i] == _friend_id) {
        return res.status(400).send("You are already friends.");
      }
    }
    currentUser.friends.push(_friend_id);
    await currentUser.save();
    res.status(200).send("Add friends successfully.");
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/deleteFriend/:_friend_id", async (req, res) => {
  let { _friend_id } = req.params;
  if (_friend_id == req.user._id) {
    return res.status(400).send("Cannot delete yourself.");
  }
  try {
    let friend = await User.findOne({ _id: _friend_id });
    for (let i = 0; i < friend.friends.length; i++) {
      if (friend.friends[i] == req.user._id) {
        friend.friends.splice(i, 1);
      }
    }
    await friend.save();
    let currentUser = await User.findOne({ _id: req.user._id });
    for (let i = 0; i < currentUser.friends.length; i++) {
      if (currentUser.friends[i] == _friend_id) {
        currentUser.friends.splice(i, 1);
      }
    }
    await currentUser.save();
    res.status(200).send("Delete friends successfully.");
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
