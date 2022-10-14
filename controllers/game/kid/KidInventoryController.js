const Kid = require("../../../models/KidModel.js")
const KidInventory = require("../../../models/KidInventory.js")
const { validationResult } = require("express-validator")

const loadKidInventory = async (req, res) => {
    const { uuid, username } = req

    try {
        const kid = await Kid.findOne({
            where: {
                uuid,
                username,
            },
        })

        const kidInventory = await KidInventory.findAll({
            where: {
                kidId: kid.id,
            },
        })

        return res.json({
            status: true,
            message: "Get kid inventory success",
            kid,
            kidInventory,
        })
    } catch (error) {
        return res.json({
            status: false,
            message: "Something went wrong",
            error,
        })
    }
}

const postKidInventory = async (req, res) => {
    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.json({
            status: false,
            message: "Validation Error",
            error: error.mapped(),
        })
    }

    const { uuid, username } = req

    try {
        const kid = await Kid.findOne({
            where: {
                uuid,
                username,
            },
        })

        await KidInventory.destroy({
            where: {
                kidId: kid.id,
            },
        })

        let insertArray = []
        req.body.inventory.forEach((e) => {
            let tempObj = {
                kidId: kid.id,
                slot: e.slot,
                name: e.name,
                amount: e.amount,
            }
            insertArray.push(tempObj)
        })

        const kidInventory = await KidInventory.bulkCreate(insertArray)

        const returnData = await Kid.findOne({
            where: {
                id: kid.id,
            },
            include: {
                model: KidInventory,
            },
        })

        return res.status(201).json({
            status: true,
            message: `${kid.name}'s inventories updated`,
            kid: returnData,
        })
    } catch (error) {
        return res.json({
            status: false,
            message: "Something went wrong",
            error,
        })
    }
}

module.exports = { loadKidInventory, postKidInventory }
