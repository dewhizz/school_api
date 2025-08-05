const {Classroom}=require('../model/SchoolDB')
const mongoose = require("mongoose");
let indexDropped = false; // Declare here at module level


exports.addClassroom = async (req, res) => {
  try {
    if (!indexDropped) {
      await mongoose.connection.collection("classrooms").dropIndex("email_1");
      console.log("Dropped index email_1");
      indexDropped = true; // Mark that index is dropped to avoid dropping again
    }

    const newClassroom = req.body;
    const savedClassroom = new Classroom(newClassroom);
    await savedClassroom.save();

    res.json(savedClassroom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// fetching classrooms
exports.getAllClassrooms= async(req,res)=>{
    try {
        const classrooms = await Classroom.find()
          .populate("teacher", "name  phone")
          .populate("students", "name addmissionNumber");
          res.json(classrooms)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// get one
exports.getClassroomsById=async (req,res)=>{
    try {
       const classroom=await Classroom.findById(req.params.id)
       .populate('teacher','name  phone')
       .populate('students','name addmissionNumber')
       if(!classroom) return res.status(404).json({message:"classroom not found"})
        res.status(200).json(classroom)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// update the classroom
exports.updateClassroom=async(req,res)=>{
    try {
        const updateClassroom=await Classroom.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )
        if(!updateClassroom) return res.status(404).json({message:'classroom not found'})
            res.status(200).json(updateClassroom)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// delete the classroom
exports.deleteClassroom=async (req,res) => {
    try {
        //  find the classroom and delete by id
    const deletedClassroom=await Classroom.findByIdAndDelete(req.params.id)
    if(!deletedClassroom) return res.status(404).json({message:"classroom not found"})
        res.json({message:'classroom deleted successfully'})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
