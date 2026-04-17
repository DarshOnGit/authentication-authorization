const mongoose = require("mongoose");

const validator = require("validator");

const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name:{
    type : String,
    required : [true , "please enter your name"]
  },
  email:{
    type : String,
    required : [true , "please enter your email"],
    unique : true ,
    lowercase : true,
    trim : true,
    validate : [validator.isEmail , "please enter a valid email"]
  },
  password:{
    type : String,
    required : [true , "please enter your password"],
    minlength : 8,
    select: false
  },
  role:{
    type : String,
    enum : ["user" , "admin"],
    default : "user"
  },
  isEmailVerified:{
    type : Boolean,
    default:false
  },
  twoFactorEnabled:{
    type : Boolean,
    default : false
  },
  twoFactorSecret:{
    type : String,
    default : undefined
  },
  tokenVersion:{
    type : Number,
    default : 0
  },
  resetPasswordToken:{
    type : String,
    default : undefined
  },
  resetPasswordExpires:{
    type : Date,
    default : undefined
  }
},{
  timestamps : true
});

userSchema.pre("save",async function(){
  if(!this.isModified("password")){
    return
  }
  this.password = await bcrypt.hash(this.password , 12);
})

const user = mongoose.model("User", userSchema);

module.exports = user ;