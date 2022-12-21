const express = require("express")

const {
    login,
    register,
} = require("../controllers/parent/ParentAuthController")
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

router.use("/cities", require("./city"))
router.use("/solepedia", require("./solepedia"))
router.use("/question", require("./question"))

module.exports = router
