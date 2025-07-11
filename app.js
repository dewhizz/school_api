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
app.use('/user/Auth',userAuth)

// connection to the db
mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("MongoDB Connected"))
.catch(err=>console.log("MongoDB connection error",err))

// listener
const PORT = 3000
app.listen(PORT,()=>{
    console.log(`Server Running On Port ${PORT}`)
})