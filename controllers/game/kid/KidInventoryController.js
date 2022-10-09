import Kid from "../../../models/KidModel.js"
import KidInventory from "../../../models/KidInventory.js"

export const loadKidInventory = async (req, res) => {
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
