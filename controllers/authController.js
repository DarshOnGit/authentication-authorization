const User = require("../models/userModel");
const {signUpSchema,loginSchema} = require("./validateSchema");
const sendEmail = require("../utils/email");
const jwt = require("jsonwebtoken");
const { createAccessToken, createRefreshToken } = require("../utils/token");



exports.signup = async (req, res, next) => {
  try {
    const validateInput = signUpSchema.parse(req.body);

    const { name, email, password } = validateInput;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "User already exists with the mail"
      });
    }

    const newUser = await User.create({
      name,
      email,
      password,
    });

    const token = jwt.sign({ id: newUser._id}, process.env.JWT_VERIFY_EMAIL_SECRET, {
      expiresIn: process.env.JWT_VERIFY_EMAIL_EXPIRES,
    });

    const verifyUrl = `${req.protocol}://${req.get("host")}/api/auth/verify-email?token=${token}`;
    const message = `Verify your Email . please use the below link to verify your email
      \n\n ${verifyUrl}`;

    try {
      await sendEmail({
        email: newUser.email,
        subject: "Email verification!",
        message
      });
    } catch (err) {
      return res.status(500).json({
        status: "fail",
        message: "Email verification failed try again later",
      });
    }

    res.status(201).json({
      status: "success",
      data: {
        newUser,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err
    });
  }
};


exports.verifyEmail = async(req,res,next)=>{
  const token = typeof req.query.token === "string" ? req.query.token : undefined ;

  if(!token){
    return res.status(400).json({
      status : "fail",
      message : 'verification token is missing'
    })
  }

  try{
    const decodedToken = jwt.verify(token , process.env.JWT_VERIFY_EMAIL_SECRET);

    const user = await User.findById(decodedToken.id);

    if(!user){
      return res.status(401).json({
        status:"fail",
        message : "the user with the given token does not exist!"
      })
    }

    if(user.isEmailVerified){
      return res.status(400).json({
        message:"Email is already verified"
      })
    }

    user.isEmailVerified = true ;
    await user.save();

    return res.status(200).json({
        message:"Email is now verified! You can login"
      })
  }
  catch(err){
    return res.status(500).json({
      status:"fail",
      message : "internal server error"
    })
  }

}

exports.login = async (req,res,next)=>{
  try {
    const validateInput = loginSchema.parse(req.body);
    const {email,password} = validateInput;

    const user = await User.findOne({email}).select("+password");
    

    if(!user || ! await user.comparePasswordInDB(password , user.password)){
      return res.status(400).json({
        status : "fail",
        message : "Incorrect Email or Password"
      });
    }

    if(!user.isEmailVerified){
      return res.status(403).json({
        status:"fail",
        message: "Please verify your email befoe logging in"
      });
    }

    const accessToken  = createAccessToken(
      user._id,
      user.role,
      user.tokenVersion
    );


    const refreshToken  = createRefreshToken(user._id,user.tokenVersion);

    const isProd = process.env.NODE_ENV === "PRODUCTION";

    res.cookie("refreshToken",refreshToken,{
      httpOnly : true,
      secure : isProd,
      sameSite : 'lax',
      maxAge : 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      status: "success",
      message: "Login Successful",
      accessToken,
      user :{
        id : user._id,
        role : user.role,
        isEmailVerified : user.isEmailVerified,
        twoFactorEnabled : user.twoFactorEnabled
      }
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err
    });
  }

}