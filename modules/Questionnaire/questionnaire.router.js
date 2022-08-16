const { auth, roles } = require('../../midlewear/auth');
const { validation } = require('../../midlewear/validation');
const { createQuestionnaire, getQuestionnaireData, getQuestionnaireByCourse, getQuestionnaireByDoctor, getQuestionnaireByAssistant } = require('./questionnaireController/questionnaire');
const { createQuestionnaireVal, getQuestionnaireVal, getQuestionnaireByCourseVal, getQuestionnaireByDoctorVal, getQuestionnaireByAssistantVal } = require('./validation');

const router = require('express').Router();






router.post('/create-questionnaire',validation(createQuestionnaireVal),createQuestionnaire)
router.post('/send-questionnaire-data',validation(getQuestionnaireVal),getQuestionnaireData)
router.get('/get-course-questionnaires/:courseCode',auth([roles.superAdmin]),validation(getQuestionnaireByCourseVal),getQuestionnaireByCourse)
router.get('/get-doctor-questionnaires/:doctorID',auth([roles.doctor,roles.superAdmin]),validation(getQuestionnaireByDoctorVal),getQuestionnaireByDoctor)
router.get('/get-assistant-questionnaires/:assistantID',auth([roles.assistant,roles.doctor,roles.superAdmin]),validation(getQuestionnaireByAssistantVal),getQuestionnaireByAssistant)







module.exports = router