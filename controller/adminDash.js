const {Student,Teacher,Parent,Classroom,User}=require('../model/SchoolDB')

// get dashboard stats
exports.adminDashStats=async(req,res)=>{
    try {
        // we run all count operations parallel for better performance
        const [totalStudents,totalTeachers,totalParents,totalClassrooms,activeUsers]=
        await Promise.all([
             Student.countDocuments(),
            Teacher.countDocuments(),
            Parent.countDocuments(),
            Classroom.countDocuments(),
            User.countDocuments({isActive:true})
        ])

        // get the most recent students to be registered (sorted by newest)
        const recentStudents=await Student.find()
        .sort({createdAt:-1})
        .limit(5)

        // get the most recent teachers
        const recentTeachers=await Teacher.find()
        .sort({createdAt:-1})
        .limit(5)

        // return all stats
        res.status(200).json({
          totalStudents,
          totalTeachers,
          totalParents,
          totalClassrooms,
          recentStudents,
          recentTeachers
        });
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}