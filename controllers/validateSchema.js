const { z } = require("zod");

const signUpSchema = z
  .object({
    name: z.string().min(1, "Name is Required"),
    email: z.string().email("Invalid Email"),
    password: z.string().min(8, "Password must be atleast 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "password and confirm password does not match",
    path: ["confirmPassword"],
  });

module.exports = signUpSchema;
