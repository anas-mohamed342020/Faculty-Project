const joi = require("joi");

const createQuestionnaireVal = {
  body: joi.object().required().keys({
    courseCode: joi.string().required(),
  }),
};
//courseCode,
// doctorID,
// assistantID,
// contentRate,
// doctorRate,
// assistantRate,
const getQuestionnaireVal = {
  body: joi
    .object()
    .required()
    .keys({
      courseID: joi.string().length(24).required(),
      doctorID: joi.string().required(),
      assistantID: joi.string().required(),
      contentRate: joi.number().max(10).min(0).required(),
      doctorRate: joi.number().max(10).min(0).required(),
      assistantRate: joi.number().max(10).min(0).required(),
    }),
};
const getQuestionnaireByCourseVal = {
  params: joi.object().required().keys({
    courseCode: joi.string().required(),
  }),
};
const getQuestionnaireByDoctorVal = {
  params: joi.object().required().keys({
    doctorID: joi.string().required(),
  }),
};
const getQuestionnaireByAssistantVal = {
  params: joi.object().required().keys({
    assistantID: joi.string().required(),
  }),
};
module.exports = {
  createQuestionnaireVal,
  getQuestionnaireVal,
  getQuestionnaireByCourseVal,
  getQuestionnaireByDoctorVal,
  getQuestionnaireByAssistantVal
};
