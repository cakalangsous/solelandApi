const Parents = require("../../../models/ParentModel.js")
const { validationResult } = require("express-validator")
const bcrypt = require("bcrypt")
const randomstring = require("randomstring")
const jwt = require("jsonwebtoken")

exports.login = async (req, res) => {
    try {
        if (req.body.email === undefined || req.body.password === undefined) {
            return res.json({
                status: false,
                message: "Please provide the email and password",
            })
        }

        const parent = await Parents.scope("withPassword").findOne({
            where: {
                email: req.body.email,
            },
        })

        const match = await bcrypt.compare(req.body.password, parent.password)

        if (!match)
            return res
                .status(200)
                .json({ status: false, message: "Wrong email or password" })

        const { uuid, username, email } = parent
        const accessToken = jwt.sign(
            { uuid, username, email },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "1d",
            }
        )

        const refreshToken = jwt.sign(
            { uuid, username, email },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: "2d",
            }
        )

        await Parents.update(
            { refreshToken: refreshToken },
            {
                where: {
                    id: parent.id,
                },
            }
        )

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 48 * 60 * 60 * 1000,
        })

        const parentData = await Parents.findOne({
            where: {
                id: parent.id,
            },
        })

        return res.status(200).json({
            status: true,
            message: "Login success",
            data: {
                parent: parentData,
                token: accessToken,
            },
        })
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            status: false,
            message: "Wrong email or password",
        })
    }
}

exports.register = async (req, res) => {
    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.status(422).json({
            status: false,
            message: "Validation Error",
            error: error.mapped(),
        })
    }

    const { username, email, password } = req.body

    const salt = await bcrypt.genSalt(10)
    const hasedPassword = await bcrypt.hash(password, salt)

    try {
        let parent = await Parents.create({
            username,
            email,
            password: hasedPassword,
            emailVerifyToken: randomstring.generate(70),
        })

        const parentData = await Parents.findOne({
            where: {
                id: parent.id,
            },
        })

        return res.status(201).json({
            status: true,
            message: "User Registered",
            data: parentData,
        })
    } catch (error) {
        console.log(error)
        return res.status(422).json({
            status: false,
            message: "Something went wrong. Please try again.",
        })
    }
}
