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
        const solepedia = await Solepedia.findAll({
            where: { city_id: city },
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
        const images = await SolepediaImage.findAll({
            where: {
                solepedia_id: solepedia_id,
            },
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
