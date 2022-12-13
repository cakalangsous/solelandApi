const KidPet = require("../../../models/KidPet")
const { validationResult } = require("express-validator")

exports.storePet = async (req, res) => {
    const { kid } = req

    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.json({
            status: false,
            message: "Validation Error",
            error: error.mapped(),
        })
    }

    const { name, type, lastHealth, customization } = req.body

    try {
        const pet = await KidPet.create({
            kid_id: kid.id,
            name,
            type,
            lastHealth,
            customization,
        })

        return res.status(201).json({
            status: true,
            message: "Create pet success",
            data: pet,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: false,
            message: "Something went wrong. Please try again.",
        })
    }
}

exports.updatePet = async (req, res) => {
    const { kid } = req

    const { uuid } = req.params
    const { name, type, lastHealth, customization } = req.body

    const pet = await KidPet.findOne({
        where: {
            uuid,
        },
    })

    if (!pet) {
        return res.status(404).json({
            status: false,
            message: "Unknown data given",
        })
    }

    try {
        if (pet.kid_id !== kid.id) {
            return res.status(200).json({
                status: false,
                message: "Unknown pet data given",
            })
        }

        pet.name = name !== undefined ? name : pet.name

        pet.type = type !== undefined ? type : pet.type

        pet.lastHealth = lastHealth !== undefined ? lastHealth : pet.lastHealth

        pet.customization =
            customization !== undefined ? customization : pet.customization

        await pet.save()

        return res.status(200).json({
            status: true,
            message: "Pet update success",
            data: pet,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: false,
            message: "Something went wrong. Please try again.",
        })
    }
}
