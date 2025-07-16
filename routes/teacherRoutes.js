const express=require('express')
const router=express.Router()
const teacherController=require('../controller/teacherController')

// authorization
const { auth, authorizeRoles }=require('../middleware/auth')

router.post('/',auth,authorizeRoles('admin'),teacherController.addTeacher)
router.get("/myclass",auth,authorizeRoles("admin", "teacher"),teacherController.getMyClasses);

router.get('/',teacherController.getAllTeachers)
router.get("/:id",teacherController.getTeacherById)
router.put("/:id",auth,authorizeRoles('admin','teacher'),teacherController.updatedTeacher);
router.delete("/:id",auth,authorizeRoles("admin", "teacher"),teacherController.deleteTeacher);
router.get("/",auth,authorizeRoles("admin", "teacher"),teacherController.getMyClasses);

module.exports=router