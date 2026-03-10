const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: false
  },
  age: {
    type: Number,
    required: false
  },
  state: {
    type: String,
    required: false
  },
  incomeClass: {
    type: String,
    enum: ["BPL", "LIG", "MIG", "HIG"],
    required: false
  },
  language: {
    type: String,
    default: "english"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("users", UserSchema);