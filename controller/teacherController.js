const { Teacher, User } = require("../model/SchoolDB");
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
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
console.log('incoming',updatedTeacher)
    if (!updatedTeacher)
      return res.status(404).json({ message: "teacher not found" });
    
    const updatedUser = await User.findOneAndUpdate(
      { teacher: updatedTeacher._id },
      { name: updatedTeacher.name,
        email:updatedTeacher.email,
        password:updatedTeacher.password
       },
       {new:true }
       
    );
    console.log("incoming", updatedUser);

      res
        .status(200)
        .json({ message: "teacher updated successfully ",teacher:updatedTeacher,User:updatedUser});
  } catch (error) {
    res.status(500).json({message:error.message})
  }
};
