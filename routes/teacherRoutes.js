const express=require('express')
const router=express.Router()
const teacherController=require('../controller/teacherController')

// authorization
const { auth, authorizeRoles }=require('../middleware/auth')

router.post('/',auth,authorizeRoles('admin'),teacherController.addTeacher)
router.get('/',teacherController.getAllTeachers)
router.get("/:id",teacherController.getTeacherById)
router.put("/:id", teacherController.updatedTeacher);
module.exports=router