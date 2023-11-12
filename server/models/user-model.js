const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
    trim: true,
  },
  birthday: {
    type: Date,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    min: 5,
    max: 50,
    trim: true,
  },
  password: {
    type: String,
    min: 6,
    max: 1024,
  },
  friends: {
    type: [String],
    default: [],
  },
  requests: {
    type: [
      {
        sentByID: {
          type: String,
        },
        sentByName: {
          type: String,
        },
      },
    ],
    default: [],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  keywords: {
    type: [String],
    default: [],
  },
  googleID: {
    type: String,
  },
});

userSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) {
      return cb(err, isMatch);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("User", userSchema);
