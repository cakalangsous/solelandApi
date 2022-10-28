const express = require("express")

const {
    login,
    register,
} = require("../controllers/game/parent/ParentAuthController.js")
const {
    parentRegisterValidator,
} = require("../validator/parentRegisterValidator.js")
const Parent = require("./parent.js")

const router = express.Router()

// parent auth routes
router.post("/login", login)
router.post("/register", parentRegisterValidator, register)

router.use("/parent", Parent)
router.use("/kid", require("./kid.js"))

module.exports = router
