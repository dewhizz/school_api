// entry file
const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const { json } = require('body-parser')
require('dotenv').config()

const app =express()

// middleware
app.use(express.json())
app.use(cors())

// static file accessibility
app.use('/uploads',express.static('uploads'))

// Login/Register routes
const userAuth=require('./routes/loginRoute')
app.use('/api/user/Auth',userAuth)

// classrooms route
const classrooms=require('./routes/classroomRoutes')
app.use('/api/classroom',classrooms)

// teachers route
const teachers=require('./routes/teacherRoutes')
app.use('/api/teacher',teachers)

// assignment route
const assignment=require('./routes/assignmentRoute')
app.use('/api/assignment',assignment)

// parent route
const parent = require("./routes/parentRoute");
app.use("/api/parent", parent);


// student route
const student = require("./routes/studentRoute");
app.use("/api/student", student);


// admin route
const admin = require("./routes/adminRoute");
app.use("/api/admin", admin);

// teacherDash route
const teacherDash = require("./routes/teacherDashRoute");
app.use("/api/teacherDash", teacherDash);

// connection to the db
mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("MongoDB Connected"))
.catch(err=>console.log("MongoDB connection error",err))

// listener
const PORT = 3000
app.listen(PORT,()=>{
    console.log(`Server Running On Port ${PORT}`)
})