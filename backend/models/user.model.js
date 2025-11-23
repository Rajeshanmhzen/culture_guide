import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    fullname:String,
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    role:{
        type:String,
        enum:["user", "admin"],
        default:'user'
    },
    profilePic : String
}, {timestamps:true}) 

export const User = mongoose.model("User", userSchema)