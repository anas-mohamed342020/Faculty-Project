const { courseModel } = require("../../../DB/models/course.model");
const { catchError } = require("../../../utils/catchError");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const path = require("path");
const fs = require("fs");
const { userModel } = require("../../../DB/models/user.model");
const { Qr_code } = require("../../../services/generateQR_code");
const addCourse = async (req, res) => {
  try {
    let { courseName, courseDesc, courseCode, doctors, assistants } = req.body;
    const foundDoc = [];
    const notFoundDoc = [];
    for (let i = 0; i < doctors.length; i++) {
      const isExisted = await userModel.findOne({
        _id: doctors[i],
        role: "doctor",
      });
      if (isExisted) {
        foundDoc.push(isExisted._id);
      } else {
        notFoundDoc.push(doctors[i]);
      }
    }
    const foundAssistant = [];
    const notFoundAssistant = [];
    for (let i = 0; i < assistants.length; i++) {
      const isExisted = await userModel.findOne({
        _id: assistants[i],
        role: "assistant",
      });
      if (isExisted) {
        foundAssistant.push(isExisted._id);
      } else {
        notFoundAssistant.push(assistants[i]);
      }
    }
    let courseData = {
      courseName,
      courseDesc,
      courseCode,
      doctors: foundDoc,
      assistants: foundAssistant,
    };
    let courseQr_code = await Qr_code(JSON.stringify(courseData));
    courseData.Qr_code=courseQr_code
    let addedCourse = await courseModel.insertMany(courseData);

    res.status(StatusCodes.ACCEPTED).json({
      status: ReasonPhrases.ACCEPTED,
      message: "Done",
      addedCourse,
      "Not founded doctors": notFoundDoc,
      "Not founded assistants": notFoundAssistant,
    });
  } catch (error) {
    catchError(res, error);
  }
};

// const upateProduct = async (req, res) => {
//   try {
//     const { product_title, Product_desc, Product_price } = req.body;
//     const { _id, role } = req.user;
//     const { id } = req.params;
//     const product = await courseModel.findById(id);
//     if (product) {
//       if (_id.toString() == product.createdBy.toString()) {
//         await courseModel.updateOne(
//           { _id: id },
//           { product_title, Product_desc, Product_price }
//         );
//         res
//           .status(StatusCodes.ACCEPTED)
//           .json({ message: "Done", status: ReasonPhrases.ACCEPTED });
//       } else {
//         res.status(StatusCodes.UNAUTHORIZED).json({
//           message: "You are UN authorized to do that",
//           status: ReasonPhrases.UNAUTHORIZED,
//         });
//       }
//     } else {
//       res.status(StatusCodes.NOT_FOUND).json({
//         message: "product not found",
//         status: ReasonPhrases.NOT_FOUND,
//       });
//     }
//   } catch (error) {
//     catchError(res, error);
//   }
// };

// const deleteProduct = async (req, res) => {
//   try {
//     const { _id, role, email } = req.user;
//     const { id } = req.params;
//     const product = await courseModel.findById(id);
//     if (product) {
//       if (_id.toString() == product.createdBy.toString() || role == "admin") {
//         await courseModel.deleteOne({ _id: id });
//         if (product.imgs.length) {
//           product.imgs.forEach((ele) => {
//             let dest = path.join(
//               __dirname,
//               `../../../uploads/${email}/product_imgs/${ele}`
//             );
//             fs.unlinkSync(dest);
//           });
//         }
//         res
//           .status(StatusCodes.ACCEPTED)
//           .json({ message: "Done", status: ReasonPhrases.ACCEPTED });
//       } else {
//         res.status(StatusCodes.UNAUTHORIZED).json({
//           message: "You are UN authorized to do that",
//           status: ReasonPhrases.UNAUTHORIZED,
//         });
//       }
//     } else {
//       res.status(StatusCodes.NOT_FOUND).json({
//         message: "product not found",
//         status: ReasonPhrases.NOT_FOUND,
//       });
//     }
//   } catch (error) {
//     catchError(res, error);
//   }
// };
// const softDelete = async (req, res) => {
//   const { id } = req.params;
//   const product = await courseModel.findOneIdAndUpdate(
//     { _id: id, isDeleted: false },
//     { isDeleted: true },
//     { new: true }
//   );
//   if (product) {
//     res
//       .status(StatusCodes.ACCEPTED)
//       .json({ message: "Done", status: ReasonPhrases });
//   }
// };
module.exports = {
  addCourse
};

/*
const name = async(req,res)=>{
    try {
        
    } catch (error) {
        catchError(res,error)
    }
}

*/
