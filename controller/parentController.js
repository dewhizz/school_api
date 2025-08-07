const {Parent,User}=require('../model/SchoolDB')
const bcrypt=require('bcrypt')

// add parent
exports.addParent=async(req,res)=>{
    try {
        // destructure variables to check if the parent exists
        const {email,nationalId,name,phone}=req.body
        // check based on email
        const existingParentEmail=await User.findOne({email})
        if(existingParentEmail) return res.json({message:'Email already taken'})
        // check using the id
        const existingParentId=await Parent.findOne({nationalId})
        if(existingParentId) return res.json({message:'National Id has already been registered'})

        // when all check are good we now save the new parent
        const newParent = new Parent(req.body)
        const savedParent =await newParent.save()

        // creating the parent user account
        const defaultPassword='parent1234'
        const hashedPassword=await bcrypt.hash(defaultPassword,10)

        const newUser = new User({
          name,
          email,
          password: hashedPassword,
          phone,
          role: "parent",
          parent:savedParent._id
        });
        await newUser.save()
        res.status(201).json({parent:savedParent,message:'Parent and User account created successfully'})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// get all parents
exports.getAllParents=async (req,res)=>{
    try {
      const parents=await Parent.find()
      res.json(parents)  
    } catch (error) {
       res.status(500).json({message:error.message}) 
    }
}

// update parent
exports.updateParent=async (req,res)=>{
    try {
        const updateParent=await Parent.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )
        if(!updateParent) return res.status(404).json({message:'Parent is not found'})
            res.status(201).json(updateParent)
    } catch (error) {
      res.status(500).json({message:error.message})  
    }
}

// delete 
exports.deleteParent=async(req,res)=>{
    try {
        const deletedParent = await Parent.findByIdAndDelete(req.params.id)
        if(!deletedParent) return res.status(404).json({message:"Parent not found"})

        // delete associated user account
        await User.findOneAndDelete({ parent: req.params.id });
        res.status(200).json({message:'Parent account deleted successfully'})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

exports.getParentById=async (req,res)=>{
    try {
        const parent=await Parent.findOne({nationalId:req.params.id})
        if(!parent) return res.json('parent not found')
            res.json(parent)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}