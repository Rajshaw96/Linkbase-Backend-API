const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    default: [],
  },
  required: {
    type: Boolean,
    default: false,
  },
});

const CreatedFormSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  questions: {
    type: [questionSchema],
    required: true,
    validate: [(val) => val.length > 0, "At least one question is required"],
  },
  roomIds: {
    type: [String], // Changed from single roomId to an array
    required: true,
    validate: [(val) => val.length > 0, "At least one room must be assigned"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CreatedForm", CreatedFormSchema);
