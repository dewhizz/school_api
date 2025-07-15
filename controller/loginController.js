const { User } = require("../model/SchoolDB");
const bcrypt = require("bcrypt");
const jwt=require('jsonwebtoken')

// register logic (admin)
exports.registerAdmin = async (req, res) => {
  const { name, email, password, secretKey } = req.body;
  // verify admin secret key
  if (secretKey !== process.env.secretKey) {
    return res.status(403).json({ message: "Unauthorized Account Creation" });
  }
  // check if the user exists
  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.json({ message: "Email has already been taken" });
  }
  // hashing the password
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    name,
    email,
    password: hashedPassword,
    role: "admin",
    isActive: true,
    teacher: null,
    parent: null,
  });
  const newUser = await user.save();
  res.status(201).json({ message: "Account Created Successfully", newUser });
};

// login user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  // console.log(email, password);
  // check if the user email exsists
  const user = await User.findOne({ email });
    if(!user) {
      return res.status(404).json({message:'Invalid credentials.....'})
    }
    // check if the user is active
    if(!user.isActive){
      return res
        .status(403)
        .json({ message: "Your account has been deactivated" });
    }
    // check the password
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
      return res.status(401).json({message:'invalid credentials'})
    }
    // generate the jwt token
    const token =jwt.sign(
      {userId:user._id,role:user.role},
      process.env.JWT_SECRET,
      {expiresIn:'1h'}
    )
  res.json({ message: "login successful",
    token,
    user:{
      id:user.id,
      name:user.name,
      email:user.email,
      role:user.role
    }
   });
};
