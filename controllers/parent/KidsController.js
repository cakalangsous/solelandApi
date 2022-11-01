const Kids = require("../../models/KidModel")
const Parents = require("../../models/ParentModel")
const { validationResult } = require("express-validator")

exports.kidRegister = async (req, res) => {
    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.json({
            status: false,
            message: "Validation Error",
            error: error.mapped(),
        })
    }

    const { uuid, email } = req
    const { name, username, password, gender } = req.body

    const salt = await bcrypt.genSalt(10)
    const hasedPassword = await bcrypt.hash(password, salt)

    try {
        const parent = await Parents.findOne({
            where: {
                uuid,
                email,
            },
        })

        let kid = await Kid.create({
            parentId: parent.id,
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
