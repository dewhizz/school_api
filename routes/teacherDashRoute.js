const express=require('express')
const router=express.Router()
const teacherController=require('../controller/teacherDashController')

// authorization
const { auth, authorizeRoles }=require('../middleware/auth')

router.get('/',auth,teacherController.teacherDash)
module.exports=router