const mongoose=require('mongoose')
const jwt =require("jsonwebtoken")

const bcrypt = require('bcryptjs')
const UserSchema=new mongoose.Schema({
    name:{
        type: String,
        required:[true,'Please provide name'],
        minlength:3,
        maxlength:50,
        unique:true

    },
    email:{
        type: String,
        required:[true,'Please provide email'],
       match:[  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,'Please provide valid email'],
       unique:true,

    },
    password:{
        type: String,
        required:[true,'Please provide password'],
        minlength:6,
      

    },
})
UserSchema.pre('save',async function(){
    const salt=await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
    

})
UserSchema.methods.createJwt=function(){
    return jwt.sign({userId:this._id,name:this.name},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})

}
UserSchema.methods.comparePassword=async function(canditatePassword){
    const isMatch=await bcrypt.compare(canditatePassword,this.password)
    return isMatch

}


module.exports=mongoose.model('User',UserSchema)