import Kid from "../../../models/KidModel.js"

export const profile = async (req, res) => {
    const { uuid, username } = req

    try {
        const kid = await Kid.findOne({
            where: {
                uuid,
                username,
            },
        })

        return res.json({
            status: true,
            message: "Get kid profile success",
            data: kid,
        })
    } catch (err) {
        return res.json({
            status: false,
            message: "Kid not found",
        })
    }
}

export const updateProfile = async (req, res) => {
    const { uuid, username } = req

    try {
        const kid = await Kid.findOne({
            where: {
                uuid,
                username,
            },
        })

        kid.level = req.body.level !== undefined ? req.body.level : kid.level
        kid.experience =
            req.body.experience !== undefined
                ? req.body.experience
                : kid.experience
        kid.last_login =
            req.body.last_login !== undefined
                ? req.body.last_login
                : kid.last_login
        kid.x_coordinate =
            req.body.x_coordinate !== undefined
                ? req.body.x_coordinate
                : kid.x_coordinate
        kid.y_coordinate =
            req.body.y_coordinate !== undefined
                ? req.body.y_coordinate
                : kid.y_coordinate

        await kid.save()

        const kidData = await Kid.findOne({
            where: {
                uuid,
                username,
            },
        })

        return res.json({
            status: true,
            message: "Kid update success",
            data: kidData,
        })
    } catch (err) {
        return res.json({
            status: false,
            message: "Kid not found",
        })
    }
}
