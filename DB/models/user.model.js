const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto-js");
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    user_id: {
      type: String,
      required: true,
      unique: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    profilePic: String,
    phone: {
      type: String,
    },
    Qr_code: {
      type: String,
    },
    Blocked: {
      type: Boolean,
      default: false,
    },
    courses: [{ type: mongoose.Types.ObjectId, ref: "Course" }],
    changePassCode: {
      type: String,
    },
    online: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: String,
    },
    role:{
      type:String,
      default:"student"
    }
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  console.log(this);
  this.password = await bcrypt.hash(this.password, Number(process.env.SALT));
  if (this.phone) {
    this.phone = crypto.AES.encrypt(this.phone, process.env.encr);
  }
  next();
});

const userModel = mongoose.model("User", userSchema);

module.exports = { userModel };
