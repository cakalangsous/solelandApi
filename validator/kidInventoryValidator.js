const { checkSchema, body } = require("express-validator")

const kidInventoryValidator = [
    // body("inventory").trim().notEmpty().withMessage("Inventory is required."),
    checkSchema({
        inventory: {
            exists: {
                errorMessage: "Please provide the inventory key",
            },
            isArray: {
                errorMessage: "Inventory should be an array of objects",
            },
            isLength: {
                errorMessage:
                    "Please provide at least 1 inventory array object",
                options: {
                    min: 1,
                },
            },
        },
        "inventory.*.name": {
            exists: {
                errorMessage: "Name is required",
            },
            isString: {
                errorMessage: "Inventory name should be a string",
            },
        },
        "inventory.*.amount": {
            exists: {
                errorMessage: "Amount is required",
            },
            isInt: {
                errorMessage: "Inventory amount should be an integer",
            },
        },
        "inventory.*.slot": {
            exists: {
                errorMessage: "Slot is required",
            },
            isInt: {
                errorMessage: "Inventory slot should be an integer",
            },
        },
    }),
]

module.exports = kidInventoryValidator
