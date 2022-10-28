const ParentModel = require("../../models/ParentModel.js")

exports.profile = (req, res) => {
    console.log(req.email, req.uuid)
    return res.json({
        status: true,
        message: "Parent Profile route",
    })
}
