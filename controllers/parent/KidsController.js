const Kids = require("../../models/KidModel")
const Parents = require("../../models/ParentModel")

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
