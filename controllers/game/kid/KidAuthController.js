import Kid from "../../../models/KidModel.js"
import { validationResult } from "express-validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const login = async (req, res) => {
    try {
        if (
            req.body.username === undefined ||
            req.body.password === undefined
        ) {
            return res.json({
                status: false,
                message: "Please provide the username and password",
            })
        }
        const kid = await Kid.scope("withPassword").findOne({
            where: {
                username: req.body.username,
            },
        })

        const match = await bcrypt.compare(req.body.password, kid.password)

        if (!match)
            return res.status(200).json({
                status: false,
                message: "Wrong username or passwords",
            })

        const { uuid, username } = kid
        const accessToken = jwt.sign(
            { uuid, username },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "1d",
            }
        )

        const refreshToken = jwt.sign(
            { uuid, username },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: "2d",
            }
        )

        kid.refreshToken = refreshToken
        await kid.save()

        res.cookie("refreshTokenKid", refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        })

        const kidData = await Kid.findOne({
            where: {
                id: kid.id,
            },
        })

        return res.status(200).json({
            status: true,
            message: "Login success",
            data: {
                kid: kidData,
                token: accessToken,
            },
        })
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            status: false,
            message: "Wrong username or password",
        })
    }
}

export const register = async (req, res) => {
    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.json({
            status: false,
            message: "Validation Error",
            error: error.mapped(),
        })
    }

    const { parent_id, name, username, password, gender } = req.body

    const salt = await bcrypt.genSalt(10)
    const hasedPassword = await bcrypt.hash(password, salt)

    try {
        let kid = await Kid.create({
            parent_id,
            name,
            username,
            password: hasedPassword,
            gender,
        })

        await kid.reload()

        delete kid.password

        return res.status(201).json({
            status: true,
            message: "Kid registered successfully",
            data: kid,
        })
    } catch (error) {}
}
