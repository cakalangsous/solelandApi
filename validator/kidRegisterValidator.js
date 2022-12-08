const check = require("express-validator").check
const Kid = require("../models/KidModel.js")

const kidRegisterValidator = [
    check("name").trim().notEmpty().withMessage("Name is required."),
    check("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required.")
        .isLength({ min: 3, max: 15 })
        .custom(async (value) => {
            const username = await Kid.findOne({ where: { username: value } })

            if (username) {
                throw new Error("Username exist")
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
    check("gender")
        .isIn(["male", "female"])
        .withMessage("Please input either male or female"),
    check("dob").trim().notEmpty().withMessage("Date of birth is required."),
]

module.exports = kidRegisterValidator
