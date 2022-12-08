const check = require("express-validator").check
const Kid = require("../models/KidModel.js")

const kidUpdateValidator = [
    check("name").trim().notEmpty().withMessage("Name is required."),
    check("gender")
        .isIn(["male", "female"])
        .withMessage("Please input either male or female"),
    check("dob").trim().notEmpty().withMessage("Date of birth is required."),
]

module.exports = kidUpdateValidator
