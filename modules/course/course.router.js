const { auth } = require('../../midlewear/auth')
const { validation } = require('../../midlewear/validation')
const { addCourse } = require('./courseController/course')
const { addCourseRole } = require('./endpoints')
const { addCourseValidation } = require('./validation')

const router = require('express').Router()










router.post('/add-course',auth(addCourseRole),validation(addCourseValidation),addCourse)
// router.patch('/update-product/:id',validation(updateProductValidation),auth(),upateProduct)
// router.delete('/delete-product/:id',validation(deleteProductValidation),auth(),deleteProduct)
// router.patch('/softdelete-product',softDelete)







module.exports = router