const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [
    {
        _id:false,
      a: { type: String, required: true },
      b: { type: String, required: true },
      c: { type: String, required: true },
      d: { type: String, required: true },
    }],
  correctAnswer: {
    type: String,
    required: true,
  },
});
const Question = mongoose.model("Question",questionSchema);

module.exports = Question;