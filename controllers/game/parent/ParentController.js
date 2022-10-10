const ParentModel = require("../../../models/ParentModel.js")

exports.profile = (req, res) => {
    console.log(req.email, req.uuid)
    res.send("parent profile")
}
