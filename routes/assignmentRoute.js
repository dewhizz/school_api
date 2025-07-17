const express=require('express')
const router=express.Router()
const assignmentController=require('../controller/assignmentController')

// authorization
const { auth, authorizeRoles }=require('../middleware/auth')

router.get('/',auth,assignmentController.getAllAssignment)
router.post("/", auth,authorizeRoles('teacher'), assignmentController.addAssignment);
router.get("/:id", auth, assignmentController.getAssignmentById);
router.put("/:id", auth,authorizeRoles('teacher'), assignmentController.updateAssigment);
router.delete("/:id", auth,authorizeRoles('teacher'), assignmentController.deleteAssignment);
module.exports=router