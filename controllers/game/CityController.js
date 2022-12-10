const City = require("../../models/City")

exports.list = async (req, res) => {
    try {
        const cities = await City.findAll()

        return res.status(200).json({
            status: true,
            message: "Get all cities success",
            data: cities,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: false,
            message: "Something went wrong. Please try again.",
        })
    }
}
