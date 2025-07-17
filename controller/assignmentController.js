const {Assignment,User,Classroom}=require('../model/SchoolDB')
// get all assignments (admin view)
// includes classroom and teacher
exports.getAllAssignment=async(req,res)=>{
    try {
        const assignments=await Assignment.find()
        .populate('classroom','name gradeLevel classYear')
        .populate('postedBy','name email phone')
        res.status(200).json(assignments)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// add assignments (only teachers)
// validate user and classroom existence
exports.addAssignment=async (req,res)=>{
    try {
        // get the logged in user
        const userId=req.user.userId
        // fetch the user and populate the teacher field if it exists
        const user = await User.findById(userId)
        .populate('teacher')
        // console.log(user)

        // block a non-teacher from posting
        if(!user || !user.teacher) return res.status(403).json({message:'Only a teacher can post'}) 
        
        // extract classroomId from the request
        const {classroom:classroomId}=req.body
        console.log(classroomId)
        // check if the classroom exist first
        const classroomExist = await Classroom.findById(classroomId)
        console.log(classroomExist)
        if(!classroomExist) return res.status(404).json({message:'classroom not found'})
            

        // prepare the assignment data
        const assignmentData={
            ...req.body,
            postedBy:user.teacher._id
        }
        // save the assignment to db
        const newAssignment=new Assignment(assignmentData)
        const savedAssignment=await newAssignment.save()
        res.status(201).json(savedAssignment)
    } catch (error) {
        
    }
}

// single assignment
// include the classroom and the teacher
exports.getAssignmentById=async(req,res)=>{
    try {
        const assignment = await Assignment.findById(req.params.id)
        .populate('classroom')
        .populate('postedBy')
        // check if it exist
        if(!assignment) return res.status(404).json({message:'Assignment Not found'})
            
            res.status(200).json(assignment)
    } catch (error) { 
        res.status(500).json({message:error.message})
    }
}

// update assignment
exports.updateAssigment=async(req,res)=>{
    try {
        // find the assignment
        const updateAssigment=await Assignment.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )
        if(!updateAssigment) return res.status(404).json({message:'assignment not found'})
            res.status(201).json({message:'assignment updated successfully',updateAssigment})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// delete assignment
exports.deleteAssignment=async (req,res) => {
    const assignmentId = req.params.id;
    const existAssignment=await Assignment.findOneAndDelete(assignmentId)
    if(!existAssignment){
        return res.status(404).json({message:'assignment not found'})
    }
    //  // unassign assignment to teacher
    // await Assignment.updateMany(
    //     {postedBy:teacherId},
    //     {$set:{teacher:null}},
        res.status(200).json({message:'Assignment deleted successfully'})
    
    res.status(200).json({message:"Assignment deleted successfully"})
}