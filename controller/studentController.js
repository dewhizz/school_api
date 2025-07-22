// db
const {Student,Classroom,Parent}=require('../model/SchoolDB')
const multer=require('multer')
const fs=require('fs')
const path=require('path')

// file location folder/directory
const upload=multer({dest:'uploads/'})


exports.uploadStudentPhoto=upload.single('photo')
exports.addStudent=async(req,res)=>{
    try {
        // destructuring
        const {name,dateOfBirth,gender,admissionNumber,parentNationalId,classroomId}=req.body
        // check if parent exist by nationalId
        const parentExist=await Parent.findOne({nationalId:parentNationalId})
        console.log('inc',parentExist)
        if(!parentExist) return res.status(404).json({message:'Parent with provided National Id not found'})
        // check if the student exist
        const studentExist=await Student.findOne({admissionNumber})
        if(studentExist) return res.json({message:'Admission No has already been assigned to someone else'})
        // check if the class exist
        const classExist=await Classroom.findById(classroomId)
        if(!classExist) return res.status(404).json({message:"Classroom not found"})

        // prepare the upload file
        let photo=null
        if (req.file){
            const ext=path.extname(req.file.originalname)
            const newFileName=Date.now()+ext
            const newPath=path.join('uploads',newFileName)
            fs.renameSync(req.file.path,newPath)
            photo=newPath.replace(/\\/g,'/')
        }

        // create student document
        const newStudent=new Student({
            name,
            dateOfBirth,
            gender,
            admissionNumber,
            photo,
            parent:parentExist._id,
            classroom:classExist._id
        })
        const savedStudent = await newStudent.save()

        // adding a student to a class using the $addToSet to prevent duplicates
        await Classroom.findByIdAndUpdate(
            classExist._id,           
            { students: null },
            { $set: { students: [] } }
            );

        
        res.status(201).json(savedStudent)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// get all
exports.getAllStudents=async(req,res)=>{
   try {
     const student = await Student.find()
       .populate("classroom",'gradeLevel classYear teacher')
       .populate("parent",'name');

     res
       .status(200)
       .json({ message: "Students fetched successfully", student });
   } catch (error) {
    res.status(500).json({message:error.message})
   }
}

// get one
exports.getStudentById=async(req,res)=>{
    try {
        const student = await Student.findById(req.params.id)
          .populate("classroom", "gradeLevel classYear teacher")
          .populate("parent", "name");

        // check if the student exists
        if (!student)
          return res.status(404).json({ message: "Student not found" });

        res.status(200).json(student);
    } catch (error) {
       res.status(500).json({ message: error.message }); 
    }
}

// update student
exports.updateStudent=async(req,res)=>{
    try {
        const updatedStudent=await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )
        if(!updatedStudent) return res.status(404).json({message:'Student not found'})
            res.status(200).json({message:'student updated successfully',updatedStudent})
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
}

// delete student
exports.deleteStudent=async(req,res)=>{
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        // check if the student exists
        if (!deletedStudent)
          return res.status(404).json({ message: "Student not found" });
        // unassign teacher to a classroom
        const student=req.classroom.student
        await Classroom.updateMany(
            {student},
            {$set:{student:null}}
        )
        res.status(200).json({ message: "Student deleted successfully" });

    } catch (error) {
           res.status(500).json({ message: error.message });
    }
}