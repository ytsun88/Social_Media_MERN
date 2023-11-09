const { json } = require("express");
const router = require("express").Router();
const registerValidator = require("../validation").registerValidator;
const loginValidator = require("../validation").loginValidator;
const User = require("../models").userModel;
const jwt = require("jsonwebtoken");

router.use((req, res, next) => {
  console.log("A request is coming into auth.js");
  next();
});

router.get("/testAPI", (req, res) => {
  const msgObj = {
    message: "Test API is working.",
  };
  return res.json(msgObj);
});

router.post("/register", async (req, res) => {
  const { error } = registerValidator(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).send("This email has been registered.");
  }
  let keywords = [];
  keywords.push(req.body.username.toLowerCase());
  let nameArray = req.body.username.split(" ");
  for (let i = 0; i < nameArray.length; i++) {
    keywords.push(nameArray[i].toLowerCase());
  }
  keywords.push(req.body.email.toLowerCase());
  keywords.push(req.body.email.split("@")[0].toLowerCase());
  const newUser = new User({
    username: req.body.username,
    birthday: req.body.birthday,
    email: req.body.email,
    password: req.body.password, // no need to hash password again because it has already been done in User model.
    keywords: keywords,
  });
  try {
    const savedUser = await newUser.save();
    res.status(200).send({
      msg: "Success.",
      savedObj: savedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send("Error! User not saved.");
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginValidator(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(401).send("Wrong email or password.");
  } else {
    user.comparePassword(req.body.password, function (err, isMatch) {
      if (err) {
        return res.status(400).send(err);
      }
      if (isMatch) {
        const tokenObj = { _id: user._id, email: user.email };
        const token = jwt.sign(tokenObj, process.env.PASSPORT_SECRET);
        res.send({ success: true, token: "JWT " + token, user });
      } else {
        res.status(400).send("Wrong email or password.");
      }
    });
  }
});

module.exports = router;
