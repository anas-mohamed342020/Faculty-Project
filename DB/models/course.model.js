const mongoose = require("mongoose");

const courseSchema = mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
    },
    courseDesc: {
      type: String,
      required: true,
    },
    courseCode: {
      type: String,
      unique:true,
      required: true,
    },
    doctors: [{
      type: mongoose.Types.ObjectId,
      ref: "User",
    }],
    assistants: [{
      type: mongoose.Types.ObjectId,
      ref: "User",
    }],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    Hidden: {
      type: Boolean,
      default: false,
    },
    Qr_code:{
      type:String
    }
  },
  {
    timeStamps: true,
  }
);

const courseModel = mongoose.model("Course", courseSchema);
module.exports = { courseModel };
