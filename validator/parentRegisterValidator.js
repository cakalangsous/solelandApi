import { check } from "express-validator";
import Parents from "../models/ParentModel.js";

export const parentRegisterValidator = [
    check("username").trim().notEmpty().withMessage("Username is required."),
    check("email")
        .notEmpty()
        .normalizeEmail()
        .isEmail()
        .withMessage("Please input a valid email address")
        .custom(async (value) => {
            const email = await Parents.findOne({ where: { email: value } })

            if (email) {
                throw new Error("Email registered");
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
                );
            }
            return true;
        }),
];
