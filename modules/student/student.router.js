const { validation } = require('../../midlewear/validation')
const { addStudent} = require('./controller/student')
const { studentSchema } = require('./student.validation')

const router = require('express').Router()




router.post('/add-student',validation(studentSchema),addStudent)

module.exports = router 