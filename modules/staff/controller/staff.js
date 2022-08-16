const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const { userModel } = require("../../../DB/models/user.model");
const { sendEmail } = require("../../../services/sendEmail");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto-js");

const { nanoid } = require("nanoid");
const { catchError } = require("../../../utils/catchError");
const { Qr_code } = require("../../../services/generateQR_code");

const addStaff = async (req, res) => {
  try {
    const { name, email,code,user_id, password, phone,role } = req.body;
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
        Qr_code:qr,
        role
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

const confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const studentData = jwt.verify(token, process.env.tokenKey);
    const student = await userModel.findById(studentData._id);
    if (student) {
      if (student.confirmed) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: "this student already verified",
          status: ReasonPhrases.BAD_REQUEST,
        });
      } else {
        const verify = await userModel.updateOne(
          { _id: student._id },
          { confirmed: true }
        );
        res
          .status(StatusCodes.ACCEPTED)
          .json({ message: "Done", status: ReasonPhrases.CONTINUE });
      }
    } else {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "student not found",
        status: ReasonPhrases.NOT_FOUND,
      });
    }
  } catch (error) {
    catchError(res, error);
  }
};

const signIn = async (req, res) => {
  try {
    const { code, password } = req.body; 
    const student = await userModel.findOne({ code });
    if (student) {
      if (student.online) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({
            message: "Sorry this user is online now",
            status: ReasonPhrases.BAD_REQUEST,
          });
      } else {
        if (student.confirmed) {
          const isTruePass = await bcrypt.compare(password, student.password);
          if (isTruePass) {
            const studentData = { _id: student._id };
            const token = jwt.sign(studentData, process.env.tokenKey);
            await userModel.updateOne({ code }, { online: true });
            res.status(StatusCodes.ACCEPTED).json({
              message: "Welcome",
              token,
              status: ReasonPhrases.ACCEPTED,
            });
          } else {
            res.status(StatusCodes.FORBIDDEN).json({
              message: "in-valid code or password",
              status: ReasonPhrases.FORBIDDEN,
            });
          }
        } else {
          res.status(StatusCodes.FORBIDDEN).json({
            message: "not confirmed email",
            status: ReasonPhrases.FORBIDDEN,
          });
        }
      }
    } else {
      res.status(StatusCodes.FORBIDDEN).json({
        message: "please confirm your email",
        status: ReasonPhrases.FORBIDDEN,
      });
    }
  } catch (error) {
    catchError(res, error);
  }
};

const update = async (req, res) => {
  try {
    const id = req.student._id;
    let { name, phone, email } = req.body;
    if (phone) {
      phone = crypto.AES.encrypt(phone, process.env.encr).toString();
    }
    if (email) {
      const subject = "confirm new email";
      const text = "click to confirm";
      const to = req.student.email;
      const token = jwt.sign(
        {
          _id: id,
        },
        process.env.tokenKey
      );
      const html = `<p>click <a style="color: white;
      background-color: blue;
      padding: 6px;
      text-decoration: none;
      border-radius: 9px;" href="${req.protocol}://${req.headers.host}/confirm-email/${token}">here</a> to confirm your email</p>`;
      sendEmail(subject, text, to, html);

      await userModel.findByIdAndUpdate(
        id,
        { name, phone, email, confirmed: false },
        { new: true }
      );
      res.status(StatusCodes.ACCEPTED).json({
        message: "Done... Please confirm your new email",
        status: ReasonPhrases.ACCEPTED,
      });
    } else {
      await userModel.findByIdAndUpdate(
        id,
        { name, phone, email },
        { new: true }
      );
      res.status(StatusCodes.ACCEPTED).json({
        message: "Done",
        status: ReasonPhrases.ACCEPTED,
      });
    }
  } catch (error) {
    catchError(res, error);
  }
};

const deletestudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await userModel.findByIdAndDelete(id);
    if (student) {
      res
        .status(StatusCodes.ACCEPTED)
        .json({ message: "Done", status: ReasonPhrases.ACCEPTED });
    } else {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "student not found", status: ReasonPhrases.NOT_FOUND });
    }
  } catch (error) {
    catchError(res, error);
  }
};

const softDelete = async (req, res) => {
  try {
    const id = req.student._id;
    const student = await userModel.findByIdAndUpdate(id, { isDeleted: true });

    if (student) {
      res
        .status(StatusCodes.ACCEPTED)
        .json({ message: "Done", status: ReasonPhrases.ACCEPTED });
    } else {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "student not found", status: ReasonPhrases.NOT_FOUND });
    }
  } catch (error) {
    catchError(res, error);
  }
};

const profilePic = async (req, res) => {
  try {
    if (req.multerError) {
      res.json({ message: "invalid picture type" });
    } else {
      const images = [];
      req.files.forEach((ele) => {
        images.push(ele.filename);
      });
      const student = await userModel.findByIdAndUpdate(
        req.student._id,
        { $push: { profilePic: [...images] } },
        { new: true }
      );
      res.json({ message: "Done", student });
    }
  } catch (error) {
    catchError(res, error);
  }
};
const coverPic = async (req, res) => {
  try {
    if (req.multerError) {
      res.json({ message: "invalid picture type" });
    } else {
      const images = [];
      req.files.forEach((ele) => {
        images.push(ele.filename);
      });

      const student = await userModel.findByIdAndUpdate(
        req.student._id,
        { $push: { coverPics: [...images] } },
        { new: true }
      );
      res.json({ message: "Done", student });
    }
  } catch (error) {
    catchError(res, error);
  }
};

const showProfilePic = async (req, res) => {
  try {
    const id = req.student._id;
    const student = await userModel.findById(id).select("profilePic -_id");

    student.profilePic = student.profilePic.map((ele) => {
      return `${req.protocol}://${req.headers.host}/uploads/${req.student.email}/profile/${ele}`;
    });
    res.json({ Pictures: student.profilePic });
  } catch (error) {
    catchError(res, error);
  }
};

const showCoverPic = async (req, res) => {
  try {
    const id = req.student._id;
    const student = await userModel.findById(id).select("coverPics -_id");

    student.coverPics = student.coverPics.map((ele) => {
      return `${req.protocol}://${req.headers.host}/uploads/${req.student.email}/cover/${ele}`;
    });
    res.json({ Pictures: student.coverPics });
  } catch (error) {
    catchError(res, error);
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  const id = nanoid(6);
  const student = await userModel.findOneAndUpdate(
    { email },
    { changePassCode: id }
  );
  if (student) {
    const subject = "password reset";
    const text = "reset code";
    const to = student.email;
    const html = `<p>use this code  <p style="color: white;
      background-color: blue;
      padding: 6px;
      text-decoration: none;
      border-radius: 9px;">${id}</p> to to reset password </p>
      <h3>This code is only used once</h3>
      `;
    sendEmail(subject, text, to, html);
    res.status(StatusCodes.ACCEPTED).json({
      message: "Done... check your mail",
      status: ReasonPhrases.ACCEPTED,
    });
  } else {
    res.status(StatusCodes.NOT_FOUND).json({ message: "student not found" });
  }
};

const changeForgetPass = async (req, res) => {
  try {
    let { email, key, password } = req.body;
    password = await bcrypt.hash(password, Number(process.env.SALT));
    const student = await userModel.findOneAndUpdate(
      { email, changePassCode: key },
      { password, changePassCode: nanoid(6) }
    );
    if (student) {
      res.status(StatusCodes.ACCEPTED).json({
        message: "Done",
        status: ReasonPhrases.ACCEPTED,
      });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "in-valid email OR key",
        status: ReasonPhrases.BAD_REQUEST,
      });
    }
  } catch (error) {
    catchError(res, error);
  }
};

const signOut = async(req,res)=>{
  try {
    const id = req.user._id;
    await userModel.findByIdAndUpdate(id,{online:false,lastSeen:Date.now()})
    res.status(StatusCodes.ACCEPTED).json({message:"Done",status:ReasonPhrases.ACCEPTED})
  } catch (error) {
    catchError(res,error)
  }
}
module.exports = {
  addStaff,
  confirmEmail,
  signIn,
  update,
  deletestudent,
  softDelete,
  profilePic,
  coverPic,
  showProfilePic,
  showCoverPic,
  forgetPassword,
  changeForgetPass,
  signOut
};
