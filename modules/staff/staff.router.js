const { auth, roles } = require('../../midlewear/auth')
const { validation } = require('../../midlewear/validation')
const { multerFunction } = require('../../multer/multer')
const { addStaff, confirmEmail, signIn, signOut } = require('./controller/staff')
const { endPoints } = require('./endPoints')
const { staffSchema } = require('./staff.validation')
const {  confirmSchema, signInScema, softDeleteSchema } = require('./staff.validation')
// const { studentSchema, confirmSchema, signInScema, updateSchema, deleteSchema, softDeleteSchema, changePassSend, changePass } = require('./student.validation')

const router = require('express').Router()




router.post('/add-staff',validation(staffSchema),auth([roles.superAdmin]),addStaff)
router.get('/confirm-email/:token',validation(confirmSchema),confirmEmail)
router.post('/signin',validation(signInScema),signIn)
router.patch('/signout',validation(softDeleteSchema),auth(),signOut)

// router.patch('/update',validation(updateSchema),auth(),update)
// router.delete('/delete/:id',validation(deleteSchema),auth(endPoints.delete),deletestudent)
// router.patch('/soft-delete',validation(softDeleteSchema),auth(),softDelete)
// router.patch('/change-pass-send',validation(changePassSend),forgetPassword)
// router.patch('/change-pass',validation(changePass),changeForgetPass)

// router.patch('/profile-pic',auth(),multerFunction('profile').array('images',5),profilePic)
// router.patch('/cover-pic',auth(),multerFunction('cover').array('images',5),coverPic)
// router.get('/profile-pic-disp',auth(),showProfilePic)
// router.get('/cover-pic-disp',auth(),showCoverPic)


module.exports = router 