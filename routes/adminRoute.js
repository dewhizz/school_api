const express=require('express')
const router=express.Router()
const adminDash=require('../controller/adminDash')

// authorization
const { auth, authorizeRoles }=require('../middleware/auth')

router.get('/',auth,authorizeRoles('admin'),adminDash.adminDashStats)
module.exports=router