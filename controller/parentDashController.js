const{User,Student, Assignment }=require('../model/SchoolDB')

// get the children belonging to the logged in parent
exports.parentDash=async(req,res)=>{
    try {
        // get the logged in user to link with the parent
        const userId=req.user.userId
        const user=await User.findById(userId)
        .populate('parent')
        
        // extract the parent id from the userId
        const parent=user.parent
        const children=await Student.find({parent:parent._id})
        .populate('classroom')
        res.status(200).json({parent,children})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// get students assignments
exports.getClassAssignments=async(req,res)=>{
    try {
        const assignments=await Assignment.find({classroom:req.params.id})
        .populate('postedBy')
        .sort({dueDate:1})
        res.json(assignments)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}