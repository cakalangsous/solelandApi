const Kid = require("../../../models/KidModel.js")
const KidInventory = require("../../../models/KidInventory.js")

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
                kid_id: kid.id,
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
    const { uuid, username } = req
    const { name, slot, amount } = req.body

    try {
        const kid = await Kid.findOne({
            where: {
                uuid,
                username,
            },
        })

        const kidInventory = await KidInventory.create({
            kid_id: kid.id,
            name,
            slot,
            amount
        })

        const kidInventoryData = KidInventory
    } catch (err) {
        
    }
}

module.exports = { loadKidInventory }
