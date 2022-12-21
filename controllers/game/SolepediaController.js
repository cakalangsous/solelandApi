const City = require("../../models/City")
const Solepedia = require("../../models/Solepedia")
const SolepediaImage = require("../../models/SolepediaImage")

exports.list = async (req, res) => {
    try {
        const solepedia = await Solepedia.findAll()

        return res.status(200).json({
            status: true,
            message: "Get all solepedia success",
            data: solepedia,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: false,
            message: "Something went wrong. Please try again.",
        })
    }
}

exports.listByCity = async (req, res) => {
    const { city } = req.params

    try {
        const solepedia = await City.findOne({
            where: {
                id: city,
            },
            attributes: ["id", "uuid", "name"],
            include: {
                model: Solepedia,
                attributes: ["id", "uuid", "title", "type"],
                include: {
                    model: SolepediaImage,
                    as: "content",
                    attributes: ["id", "uuid", "solepedia_id", "content"],
                },
            },
        })

        solepedia.solepedia.map((sole) => {
            sole.content.map((image) => {
                image.setDataValue(
                    "content_url",
                    `${process.env.IMAGE_URL}${image.content}`
                )
                image.content = undefined
            })
        })

        return res.status(200).json({
            status: true,
            message: "Get solepedia by city success",
            data: solepedia,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: false,
            message: "Something went wrong. Please try again.",
        })
    }
}

exports.listImageBySolepedia = async (req, res) => {
    const { solepedia_id } = req.params

    try {
        const images = await Solepedia.findOne({
            where: {
                id: solepedia_id,
            },
            attributes: ["id", "uuid", "title", "type"],
            include: {
                model: SolepediaImage,
                as: "content",
                attributes: ["id", "uuid", "solepedia_id", "content"],
            },
        })

        images.content.map((image) => {
            image.setDataValue(
                "content_url",
                `${process.env.IMAGE_URL}${image.content}`
            )
            image.content = undefined
        })

        return res.status(200).json({
            status: true,
            message: "Get images by solepedia ID success",
            data: images,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: false,
            message: "Something went wrong. Please try again.",
        })
    }
}
