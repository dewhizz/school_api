const express=require('express')
const router=express.Router()
const ClassroomController=require('../controller/classroomController')
// authorization
const { auth, authorizeRoles }=require('../middleware/auth')

router.post('/',auth,authorizeRoles('admin'),ClassroomController.addClassroom)
router.get('/',auth, ClassroomController.getAllClassrooms)
router.get("/:id",auth, ClassroomController.getClassroomsById);
router.put("/:id",auth,authorizeRoles('admin'), ClassroomController.updateClassroom);
router.delete("/:id",auth,authorizeRoles('admin'), ClassroomController.deleteClassroom);


module.exports=router