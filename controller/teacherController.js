const { Teacher, User, Classroom,Assignment } = require("../model/SchoolDB");
const bcrypt = require("bcrypt");
// add teacher
exports.addTeacher = async (req, res) => {
  try {
    // check if the teacher exist
    const { email } = req.body;

    const existUserEmail = await User.findOne({ email });
    if (existUserEmail) return res.json({ message: "Email already taken" });

    const existEmail = await Teacher.findOne({ email });
    if (existEmail)
      return res.json({ message: "Email of the teacher already taken" });
    // create the teacher
    const newTeacher = new Teacher(req.body);
    const savedTeacher = await newTeacher.save();

    // we create a corresponding user document
    // default password
    const defaultPassword = "teacher1234";
    const password = await bcrypt.hash(defaultPassword, 10);

    // create newUser
    const newUser = new User({
      name: savedTeacher.name,
      email: savedTeacher.email,
      password,
      role: "teacher",
      teacher: savedTeacher._id,
    });
    await newUser.save();
    res
      .status(201)
      .json({
        message: "Teacher registered successfully",
        teacher: savedTeacher,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// fetch all
exports.getAllTeachers = async (req, res) => {
  try {
    const teacher = await Teacher.find();
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// fetch one
exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update
exports.updatedTeacher = async (req, res) => {
  try {
    const teacherId=req.params.id
    const userId=req.user.userId
    const updateData=req.body

    // check if the User exists
    const existUser= await User.findById(userId)
    if(!existUser) return res.status(404).json({message:'User not found'})

    // check if the teacher exists
    const existTeacher=await Teacher.findById(teacherId)
    if(!existTeacher) return res.status(404).json({message:'Teacher not found'})
      if(updateData.password && req.user.role=='admin'){
        return res.status(403).json({message:"Permission denied"})
      }

      if(req.user.role=='teacher' && existTeacher.teacher.toString()!==teacherId){
        return res.status(403).json({message:'Access denied'})
      }
      if(updateData.password){
        const hashedPassword=await bcrypt.hash(updateData.password,10)
        updateData.password=hashedPassword
      }

      const user=await User.findOne({teacher:teacherId})
      const savedUser=await User.findByIdAndUpdate(
        user._id,updateData,{new:true})
      const savedTeacher=await Teacher.findByIdAndUpdate(teacherId,updateData,{new:true})
      res.json({message:'Teacher Updated Successfully'})
  } catch (error) {
    res.status(500).json({message:error.message})
  }
};

// delete teacher
exports.deleteTeacher=async(req,res)=>{
 try {
   // teacher id from params
  const teacherId=res.params.id
  // delete teacher
  const deleteTeacher=await Teacher.findOneAndDelete(teacherId)
  if(!deleteTeacher) return res.statu(404).json({message:'teacher not found'})
  // unassign the teacher from any classrom
await Classroom.updateMany(
  {teacher:teacherId},
  {$set:{teacher:null}})
  res.status(200).json({message:'teacher deleted successfully'})

 } catch (error) {
      res.status(500).json({message:error.message})
  }
}

// get Teachers Classes
exports.getMyClasses=async(req,res)=>{
  try {
    // logged in user
    const userId=req.user.userId
    // find all classes for the teacher
    const user=await User.findById(userId)
    .populate('teacher')

    // check if the user exists and is linked to a teacher
    if(!user ||!user.teacher){
      return res.status(500).json({ message: "Teacher not found" });
    }
      const classes=await Classroom.find({teacher:user.teacher._id})
      .populate('students')
      res.status(200).json(classes)
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}

// get teachers assignment
// includes classroom and teacher
exports.getAllAssignment=async(req,res)=>{
    try {
        // logged in user
        const userId=req.user.userId
        const user=await User.findById(userId)
        .populate('teacher')


        const assignments=await Assignment.find({postedBy:user.teacher._id})
        .populate('classroom','name gradeLevel classYear')
        .populate('postedBy','name email phone')
        res.status(200).json(assignments)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

