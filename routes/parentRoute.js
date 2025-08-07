const express=require('express')
const router=express.Router()
const parentController=require('../controller/parentController')

// authorization
const { auth, authorizeRoles }=require('../middleware/auth')

router.post('/',parentController.addParent)
router.get("/", parentController.getAllParents);
router.get("/:id", parentController.getParentById);
router.put("/:id", parentController.updateParent);
router.delete("/:id",parentController.deleteParent);


module.exports=router