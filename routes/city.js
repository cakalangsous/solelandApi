const express = require("express")

const { list } = require("../controllers/game/CityController")
const verifyKidToken = require("../middleware/verifyKidToken.js")

const router = express.Router()

router.get("/", verifyKidToken, list)

module.exports = router
