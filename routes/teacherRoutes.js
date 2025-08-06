const express=require('express')
const router=express.Router()
const teacherController=require('../controller/teacherController')

// authorization
const { auth, authorizeRoles }=require('../middleware/auth')

router.post('/',auth,authorizeRoles('admin'),teacherController.addTeacher)
// documents associated with the teacher
router.get("/myclass",auth,authorizeRoles("admin", "teacher"),teacherController.getMyClasses);
router.get("/myassignments",auth,teacherController.getAllAssignment);

router.get('/',teacherController.getAllTeachers)
router.get("/:id",teacherController.getTeacherById)
router.put("/:id",auth,authorizeRoles('admin','teacher'),teacherController.updatedTeacher);
router.delete("/:id",auth,authorizeRoles("admin"),teacherController.deleteTeacher);


module.exports=router