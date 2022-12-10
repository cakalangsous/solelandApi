const express = require("express")

const verifyKidToken = require("../middleware/verifyKidToken.js")
const {
    list,
    listByCity,
    listImageBySolepedia,
} = require("../controllers/game/SolepediaController")
const app = express()

app.get("/", verifyKidToken, list)
app.get("/:city", verifyKidToken, listByCity)
app.get("/images/:solepedia_id", verifyKidToken, listImageBySolepedia)

module.exports = app
