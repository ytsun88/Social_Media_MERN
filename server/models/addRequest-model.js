const mongoose = require("mongoose");

const addRequestSchema = new mongoose.Schema({
  senderID: {
    type: String,
  },
  senderName: {
    type: String,
  },
  receiverID: {
    type: String,
  },
  receiverName: {
    type: String,
  },
  approve: {
    type: Boolean,
    default: null,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("AddRequest", addRequestSchema);
