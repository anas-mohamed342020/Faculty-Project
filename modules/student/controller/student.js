const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const { userModel } = require("../../../DB/models/user.model");
const { sendEmail } = require("../../../services/sendEmail");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto-js");

const { nanoid } = require("nanoid");
const { catchError } = require("../../../utils/catchError");
const { Qr_code } = require("../../../services/generateQR_code");

const addStudent = async (req, res) => {
  try {
    const { name, email,code,user_id, password, phone } = req.body;
    const student = await userModel.findOne({ email });
    if (student) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "email already exist" });
    } else {
      const qr = await Qr_code({
        name,
        user_id,
        code,
        phone
      })
      console.log({qr});
      let addstudent = new userModel({
        name,
        email,
        password,
        phone,
        code,
        user_id,
        Qr_code:qr
      });
      addstudent = await addstudent.save();
      const subject = "E-mail confirmation";
      const text = "please active your account";
      const to = addstudent.email;
      const token = jwt.sign(
        {
          _id: addstudent._id,
        },
        process.env.tokenKey
      );
      const html = `<p>click <a style="color: white;
      background-color: blue;
      padding: 6px;
      text-decoration: none;
      border-radius: 9px;" href="${req.protocol}://${req.headers.host}/confirm-email/${token}">here</a> to confirm your email</p>`;
      sendEmail(subject, text, to, html);
      res
        .status(StatusCodes.CREATED)
        .json({ message: "Done", status: ReasonPhrases.CREATED });
    }
  } catch (ERROR) {
    catchError(res, ERROR);
  }
};


module.exports = {
  addStudent,
};
