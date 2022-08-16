const express = require('express')
const { connection } = require('./DB/config')
const app = express()
require('dotenv').config()
app.use(express.json())
const port = process.env.PORT
connection()

const userRouter = require('./modules/student/student.router')
const staffRouter = require('./modules/staff/staff.router')
const courseRouter = require('./modules/course/course.router')
const questionnaireRouter = require('./modules/Questionnaire/questionnaire.router')
app.use(userRouter,staffRouter,courseRouter,questionnaireRouter)
app.use('/uploads',express.static('uploads'))

app.get('/',(req,res)=>{
    res.json({message:"Welcome to Faculty-Project API"})
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`)) 


