const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const { courseModel } = require("../../../DB/models/course.model");
const {
  questionnaireModel,
} = require("../../../DB/models/Questionnaire.model");
const { userModel } = require("../../../DB/models/user.model");
const { catchError } = require("../../../utils/catchError");

const populate = [
    {
      path: "doctorID",
      select: "name user_id Qr_code",
    },
    {
      path: "assistantID",
      select: "name user_id Qr_code",
    },
    {
      path: "courseID",
      select: "courseName courseDesc courseCode Qr_code" ,
    },

  ]



const createQuestionnaire = async (req, res) => {
  try {
    const { courseCode } = req.body;
    const courseData = await courseModel
      .findOne({ courseCode })
      .select("-Hidden -isDeleted")
      .populate([
        {
          path: "doctors",
          select: "name user_id",
        },
        {
          path: "assistants",
          select: "name user_id",
        },
      ]);
    if (courseData) {
      res
        .status(StatusCodes.ACCEPTED)
        .json({ status: ReasonPhrases.ACCEPTED, courseData });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: ReasonPhrases.BAD_REQUEST,
        message: "in-valid course code",
      });
    }
  } catch (error) {
    catchError(res, error);
  }
};

const getQuestionnaireData = async (req, res) => {
  try {
    const {
      courseID,
      doctorID,
      assistantID,
      contentRate,
      doctorRate,
      assistantRate,
    } = req.body;

    const course = await courseModel.findOne({ _id:courseID });
    if (!course) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: ReasonPhrases.BAD_REQUEST,
        message: "in-valid course ID",
      });
    } else {
      const doctor = await userModel.findOne({
        _id: doctorID,
        role: "doctor",
      });
      if (doctor) {
        const assistant = await userModel.findOne({
          _id: assistantID,
          role: "assistant",
        });
        if (assistant) {
          const Questionnaire = await questionnaireModel.insertMany({
            courseID,
            doctorID,
            assistantID,
            contentRate,
            doctorRate,
            assistantRate,
          });
          res
            .status(StatusCodes.CREATED)
            .json({ status: ReasonPhrases.CREATED, Questionnaire });
        } else {
          res.status(StatusCodes.BAD_REQUEST).json({
            status: ReasonPhrases.BAD_REQUEST,
            message: "in-valid assistant ID",
          });
        }
      } else {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: ReasonPhrases.BAD_REQUEST,
          message: "in-valid doctor ID",
        });
      }
    }
  } catch (error) {
    catchError(res, error);
  }
};

const getQuestionnaireByCourse = async (req, res) => {
    try {
        const { courseCode } = req.params;
        const course = await courseModel.findOne({ courseCode });
        if (course) {
          const Questionnaires = await questionnaireModel
            .find({ courseCode })
            .populate(populate);
          if (Questionnaires.length) {
            res
              .status(StatusCodes.ACCEPTED)
              .json({ status: ReasonPhrases.ACCEPTED, Questionnaires });
          } else {
            res.status(StatusCodes.NOT_FOUND).json({
              status: ReasonPhrases.NOT_FOUND,
              message: "No Questionnaires for this course",
            });
          }
        } else {
          res.status(StatusCodes.BAD_REQUEST).json({
            status: ReasonPhrases.BAD_REQUEST,
            message: "in-valid course ID",
          });
        }      
    } catch (error) {
        catchError(res,error)
    }
};

const getQuestionnaireByDoctor = async (req, res) => {
    try {
        const { doctorID } = req.params;
        const doctor = await userModel.findOne({ _id:doctorID,role:"doctor" });
        if (doctor) {
          const Questionnaires = await questionnaireModel
            .find({ doctorID })
            .populate(populate);
          if (Questionnaires.length) {
            res
              .status(StatusCodes.ACCEPTED)
              .json({ status: ReasonPhrases.ACCEPTED, Questionnaires });
          } else {
            res.status(StatusCodes.NOT_FOUND).json({
              status: ReasonPhrases.NOT_FOUND,
              message: "No Questionnaires for this doctor",
            });
          }
        } else {
          res.status(StatusCodes.BAD_REQUEST).json({
            status: ReasonPhrases.BAD_REQUEST,
            message: "in-valid doctor ID",
          });
        }      
    } catch (error) {
        catchError(res,error)
    }
};

const getQuestionnaireByAssistant = async (req, res) => {
    try {
        const { assistantID } = req.params;
        const assistant = await userModel.findOne({ _id:assistantID,role:"assistant" });
        if (assistant) {
          const Questionnaires = await questionnaireModel
            .find({ assistantID })
            .populate(populate);
          if (Questionnaires.length) {
            res
              .status(StatusCodes.ACCEPTED)
              .json({ status: ReasonPhrases.ACCEPTED, Questionnaires });
          } else {
            res.status(StatusCodes.NOT_FOUND).json({
              status: ReasonPhrases.NOT_FOUND,
              message: "No Questionnaires for this assistant",
            });
          }
        } else {
          res.status(StatusCodes.BAD_REQUEST).json({
            status: ReasonPhrases.BAD_REQUEST,
            message: "in-valid assistant ID",
          });
        }      
    } catch (error) {
        catchError(res,error)
    }
};


module.exports = { createQuestionnaire, getQuestionnaireData,getQuestionnaireByCourse ,getQuestionnaireByDoctor ,getQuestionnaireByAssistant};

/*

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



*/
