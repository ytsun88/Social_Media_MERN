const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxLength: 20,
  },
  content: {
    type: String,
  },
  poster: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  like: {
    type: [String],
    default: [],
  },
  comment: {
    type: [
      {
        commenterID: {
          type: String,
        },
        commenterName: {
          type: String,
        },
        commentID: {
          type: String,
          default: function () {
            return this.commenterID + Date.now().toString();
          },
        },
        content: {
          type: String,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    default: [],
  },
});

module.exports = mongoose.model("Post", postSchema);
