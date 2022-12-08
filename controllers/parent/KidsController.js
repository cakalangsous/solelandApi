const Kids = require("../../models/KidModel")
const Parents = require("../../models/ParentModel")
const { validationResult } = require("express-validator")
const bcrypt = require("bcrypt")
const { getAge } = require("../../utils/getAge")

exports.kidRegister = async (req, res) => {
    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.status(422).json({
            status: false,
            message: "Validation Error",
            error: error.mapped(),
        })
    }

    const { uuid, email } = req
    const { name, username, password, gender, dob } = req.body

    const parent = await Parents.findOne({
        where: {
            uuid,
            email,
        },
    })

    if (!parent) {
        return res.status(422).json({
            status: false,
            message: "Unknown token data",
        })
    }
    try {
        const salt = await bcrypt.genSalt(10)
        const hasedPassword = await bcrypt.hash(password, salt)

        let kid = await Kids.create({
            parentId: parent.id,
            name,
            username,
            password: hasedPassword,
            gender,
            dob,
        })

        return res.status(201).json({
            status: true,
            message: "Kid registered successfully",
            data: kid,
        })
    } catch (error) {
        console.log(error)
    }
}

exports.getKids = async (req, res) => {
    const { uuid, email } = req

    const parent = await Parents.findOne({
        where: {
            uuid,
            email,
        },
    })

    if (!parent) {
        return res.status(406).json({
            status: false,
            message: "Unknown data given.",
        })
    }

    try {
        const kids = await Kids.findAll({
            where: {
                parentId: parent.id,
            },
        })

        kids.map((kid) => {
            kid.setDataValue("age", getAge(kid.dob))
        })

        return res.json({
            status: true,
            message: "Get Kids success",
            kids: kids,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: false,
            message: "Unknown error. Please try again",
        })
    }
}

exports.update = async (req, res) => {
    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.status(422).json({
            status: false,
            message: "Validation Error",
            error: error.mapped(),
        })
    }

    const { uuid } = req.params
    const parentUuid = req.uuid
    const email = req.email

    const parent = await Parents.findOne({
        where: {
            uuid: parentUuid,
            email,
        },
    })

    if (!parent) {
        return res.status(406).json({
            status: false,
            message: "Unknown data given.",
        })
    }

    try {
        const kid = await Kids.findOne({
            where: {
                uuid,
            },
        })

        if (kid.parentId !== parent.id) {
            return res
                .status(404)
                .json({ status: false, message: "Unknown data" })
        }

        kid.name = req.body.name
        kid.gender = req.body.gender
        kid.dob = req.body.dob

        if (req.body.password !== undefined) {
            const salt = await bcrypt.genSalt(10)
            const hasedPassword = await bcrypt.hash(password, salt)

            kid.password = hasedPassword
        }

        await kid.save()

        const kidData = await Kids.findOne({
            where: {
                uuid,
            },
        })

        kidData.setDataValue("age", getAge(kidData.dob))

        return res.json({
            status: true,
            message: "Kid update success",
            data: kidData,
        })
    } catch (err) {
        return res.json({
            status: false,
            message: "Kid not found",
            error: err,
        })
    }
}

exports.destroy = async (req, res) => {
    const { uuid } = req.params

    const parentUuid = req.uuid
    const email = req.email

    const parent = await Parents.findOne({
        where: {
            uuid: parentUuid,
            email,
        },
    })

    if (!parent) {
        return res.status(406).json({
            status: false,
            message: "Unknown data given.",
        })
    }

    try {
        const kid = await Kids.findOne({
            where: {
                uuid,
            },
        })

        if (kid.parentId !== parent.id) {
            return res
                .status(404)
                .json({ status: false, message: "Unknown data" })
        }

        await kid.destroy()

        return res.status(200).json({ status: true, message: "Kid deleted" })
    } catch (error) {
        return res.json({
            status: false,
            message: "Data not found",
            error,
        })
    }
}
