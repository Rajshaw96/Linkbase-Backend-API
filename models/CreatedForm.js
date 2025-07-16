const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true, // Question text is mandatory
  },
  type: {
    type: String,
    required: true, // Type must be specified (e.g., "text", "multiple")
  },
  options: {
    type: [String],
    default: [], // Safe default
  },
  required: {
    type: Boolean,
    default: false,
  },
});

const CreatedFormSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Form title must be provided
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
  roomId: {
    type: String,
    required: true, // Room assignment must be provided
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CreatedForm", CreatedFormSchema);
