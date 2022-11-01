const Parents = require("../../models/ParentModel.js")
const { validationResult } = require("express-validator")
const bcrypt = require("bcrypt")
const randomstring = require("randomstring")
const jwt = require("jsonwebtoken")
const { transporter, handlebarOptions } = require("../../config/email")
const hbs = require("nodemailer-express-handlebars")
const rootDir = require("path").resolve("./")

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
                .status(404)
                .json({ status: false, message: "Wrong email or password" })

        if (!parent.emailVerifiedAt) {
            return res.status(401).json({
                status: false,
                message: "Please verify your email first.",
            })
        }

        const { uuid, username, email } = parent
        const accessToken = jwt.sign(
            { uuid, username, email },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "10s",
            }
        )

        const refreshToken = jwt.sign(
            { uuid, username, email },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: "1d",
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
            maxAge: 24 * 60 * 60 * 1000,
            secure: true,
        })

        const parentData = await Parents.findOne({
            where: {
                id: parent.id,
            },
            attributes: {
                uuid,
                username,
                email,
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
        return res.status(422).json({
            status: false,
            message: "Wrong email or password",
            error,
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

        const parentData = await Parents.scope("withEmailVerifyToken").findOne({
            where: {
                id: parent.id,
            },
        })

        transporter.use("compile", hbs(handlebarOptions))

        const emailToken = jwt.sign(
            { parent: parentData.emailVerifyToken },
            process.env.EMAIL_SECRET,
            { expiresIn: "3d" }
        )

        const link = `${process.env.FRONTEND_URL}/confirm/${emailToken}?`

        var mailOptions = {
            from: process.env.MAIL_FROM,
            to: parentData.email,
            subject: `${process.env.MAIL_FROM_NAME_PREFIX} - Please verify your email`,
            template: "verify-email",
            context: {
                username,
                link,
            },
            attachments: [
                {
                    filename: "logo-landscape.png",
                    path: rootDir + "/assets/logo-landscape.png",
                    cid: "logo-landscape",
                },
            ],
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
            } else {
                console.log("email sent " + info.response)
            }
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
            error,
        })
    }
}

exports.confirm = async (req, res) => {
    const emailVerifyToken = req.params.emailVerifyToken

    try {
        const decoded = jwt.verify(emailVerifyToken, process.env.EMAIL_SECRET)

        console.log(decoded)

        const parent = await Parents.scope("withEmailVerifyToken").findOne({
            where: { emailVerifyToken: decoded.parent },
        })

        if (!parent) {
            return res.status(404).json({
                status: false,
                message: "Data not found",
            })
        }

        Parents.update(
            {
                emailVerifiedAt: new Date(),
                emailVerifyToken: randomstring.generate(70),
            },
            {
                where: { id: parent.id },
            }
        )

        return res.json({
            status: true,
            message: "Email verified",
        })
    } catch (err) {
        console.log("Error verify email ", err)
    }
}

exports.logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) return res.status(204)

    const parent = await Parents.findOne({
        where: {
            refreshToken,
        },
    })
    if (!parent) return res.status(204)

    const parentId = parent.id
    await Parents.update(
        {
            refreshToken: null,
        },
        {
            where: { id: parentId },
        }
    )

    res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
    })
    return res.status(200).json({
        status: true,
        message: "Logged out",
    })
}

exports.forgotPassword = async (req, res) => {
    const email = req.body.email

    if (!email) {
        return res.status(422).json({
            status: false,
            message: "The email is required",
        })
    }

    const parent = await Parents.findOne({
        where: {
            email,
        },
    })

    if (!parent) {
        return res.status(404).json({
            status: false,
            message: "Unknown email",
        })
    }

    console.log(parent)
}
