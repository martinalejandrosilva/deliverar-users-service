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
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),

  body("name").exists().withMessage("Name is required"),
];

exports.validateLogin = [
  body("email").exists().withMessage("Email is required"),

  body("password").exists().withMessage("Password is required"),
];

exports.validateSupplierRegister = [
  body("cuit")
    .exists()
    .isLength({ min: 13, max: 13 })
    .withMessage("CUIT must be 11 digits long")
    .matches(/^\d{2}-\d{8}-\d$/)
    .withMessage("CUIT must be in the format XX-XXXXXXXX-X")
    .bail()
    .custom((value: string) => {
      const numericCUIT = value.replace(/-/g, "");
      return true;
    }),
  body("password")
    .exists()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .withMessage("Password is required")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  body("name").exists().withMessage("Name is required"),
  body("businessName").exists().withMessage("Business name is required"),
  body("domain").exists().withMessage("Domain is required"),
  body("address").exists().withMessage("Address is required"),
  body("phone").exists().withMessage("Phone is required"),
  body("category").exists().withMessage("Category is required"),
  body("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is not valid"),
  body("primaryColor").exists().withMessage("Primary color is required"),
  body("secondaryColor").exists().withMessage("Secondary color is required"),
];

exports.validateSupplierUpdate = [
  body("cuit")
    .exists()
    .isLength({ min: 13, max: 13 })
    .withMessage("CUIT must be 11 digits long")
    .matches(/^\d{2}-\d{8}-\d$/)
    .withMessage("CUIT must be in the format XX-XXXXXXXX-X")
    .bail()
    .custom((value: string) => {
      const numericCUIT = value.replace(/-/g, "");
      return true;
    }),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .withMessage("Password is required")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  body("email").isEmail().withMessage("Email is not valid"),
];

exports.validateSupplierLogin = [
  body("cuit")
    .isLength({ min: 13, max: 13 })
    .withMessage("CUIT must be 11 digits long")
    .matches(/^\d{2}-\d{8}-\d$/)
    .withMessage("CUIT must be in the format XX-XXXXXXXX-X")
    .bail()
    .custom((value: string) => {
      const numericCUIT = value.replace(/-/g, "");
      return true;
    }),

  body("password").exists().withMessage("Password is required"),
];

exports.validateSupplierLogin = [
  body("cuit").exists().withMessage("cuit is required"),

  body("password").exists().withMessage("Password is required"),
];
