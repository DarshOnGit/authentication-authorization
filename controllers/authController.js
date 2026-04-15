const User = require("../models/userModel");
const signUpSchema = require("./validateSchema");

exports.signup = async (req, res, next) => {
  try {
    const validateInput = signUpSchema.parse(req.body);

    const { name, email, password } = validateInput;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "User already exists",
      });
    }

    const newUser = await user.create({
      name,
      email,
      password,
    });

    

    res.status(201).json({
      status: "success",
      data: {
        newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
};
