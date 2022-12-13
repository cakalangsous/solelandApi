const check = require("express-validator").check
const kidPetValidator = [
    check("name").trim().notEmpty().withMessage("Name is required."),
    check("type")
        .isIn(["Playto", "Dela", "Bravo"])
        .withMessage("Please input either Playto, Dela or Bravo"),
    check("lastHealth").notEmpty().withMessage("Last health is required"),
]

module.exports = kidPetValidator
