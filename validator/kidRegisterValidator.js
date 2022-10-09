import { check } from "express-validator";
import Kid from "../models/KidModel.js";

export const kidRegisterValidator = [
    check("parent_id").trim().notEmpty().withMessage("Parent UUID is required."),
    check("name").trim().notEmpty().withMessage("Name is required."),
    check("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required.")
        .custom(async (value) => {
            const username = await Kid.findOne({ where: { username: value } });

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
    check('gender').isIn(['male', 'female']).withMessage('Please input either male or female')
];
