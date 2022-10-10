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

module.exports = { loadKidInventory }
