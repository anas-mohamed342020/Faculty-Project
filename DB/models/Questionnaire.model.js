const mongoose = require("mongoose");
const questionnaireSchema = mongoose.Schema(
  {
    courseID: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Course",
    },
    doctorID: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    assistantID: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    contentRate: {
      type: Number,
      required: true,
    },
    doctorRate: {
      type: Number,
      required: true,
    },
    assistantRate: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


const questionnaireModel = mongoose.model("Questionnaire", questionnaireSchema);

module.exports = { questionnaireModel };
