const express = require("express")
const parent = require("../controllers/game/parent/ParentController.js")
const router = express.Router()

router.get("/profile", parent.profile)

module.exports = router
