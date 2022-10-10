const check = require("express-validator").check
const Parents = require("../models/ParentModel.js")

exports.parentRegisterValidator = [
    check("username").trim().notEmpty().withMessage("Username is required."),
    check("email")
        .notEmpty()
        .normalizeEmail()
        .isEmail()
        .withMessage("Please input a valid email address")
        .custom(async (value) => {
            const email = await Parents.findOne({ where: { email: value } })

            if (email) {
                throw new Error("Email registered")
            }
        }),
    check("password").notEmpty().withMessage("Password is required"),
    check("password_confirmation")
        .notEmpty()
        .withMessage("Password confirmation is required")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error(
                    "Password confirmation doesn't match with password"
                )
            }
            return true
        }),
]
