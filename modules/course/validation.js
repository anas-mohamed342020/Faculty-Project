const joi = require("joi");
const addCourseValidation = {
  body: joi
    .object()
    .required()
    .keys({
      courseName: joi
        .string()
        .required()
        .pattern(RegExp("^[a-zA-Z0-9_.]*$")),
        courseDesc: joi.string().required(),
        courseCode: joi.string().required(),
        doctors:joi.array(),
        assistants:joi.array()
    }),
  params: joi.object().required().keys({}),
  query: joi.object().required().keys({}),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};





const updateProductValidation = {
  body: joi
    .object()
    .required()
    .keys({
      product_title: joi
        .string()
        .required()
        .pattern(RegExp("^[a-zA-Z0-9_.]*$")),
      Product_desc: joi.string().required(),
      Product_price: joi.string().required(),
    }),
  params: joi.object().required().keys({
    id:joi.string().length(24).required()
  }),
  query: joi.object().required().keys({}),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};




const deleteProductValidation = {
  body: joi.object().required().keys({}),
  params: joi.object().required().keys({
    id:joi.string().length(24).required()
  }),
  query: joi.object().required().keys({}),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};














module.exports = {addCourseValidation,updateProductValidation,deleteProductValidation}
/*


const softDeleteSchema = {
  body:joi.object().required().keys({}),
  params:joi.object().required().keys({}),
  query:joi.object().required().keys({}),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
}


*/
