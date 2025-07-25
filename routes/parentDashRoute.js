const express=require('express')
const router=express.Router()
const parentDashController=require('../controller/parentDashController')

// authorization
const { auth, authorizeRoles }=require('../middleware/auth')

router.get("/", auth, authorizeRoles('parent'), parentDashController.parentDash);
router.get("/:id", auth, authorizeRoles('parent'), parentDashController.getClassAssignments);
module.exports=router