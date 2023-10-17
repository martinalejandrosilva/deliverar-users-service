const { body } = require("express-validator");

exports.validateRegister = [
  //email validation
  body("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is not valid"),

  //password validation
  body("password")
    .exists()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .withMessage("Password is required")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),

  body("name").exists().withMessage("Name is required"),

  body("isProvider").exists().withMessage("isProvider is required"),
];

exports.validateLogin = [
  body("email").exists().withMessage("Email is required"),

  body("password").exists().withMessage("Password is required"),
];
