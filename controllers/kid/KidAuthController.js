import Parents from "../../models/ParentModel.js"
import { validationResult } from "express-validator"
import bcrypt from "bcrypt"
import randomstring from "randomstring"
import jwt from 'jsonwebtoken' 

export const login = async (req, res) => {
    res.send('kid login')
}

export const register = async (req, res) => {
    res.send('kid register')
}
