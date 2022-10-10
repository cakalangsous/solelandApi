const express = require("express")

const {
    login,
    register,
} = require("../controllers/game/kid/KidAuthController.js")
const kid = require("../controllers/game/kid/KidController.js")
const {
    loadKidInventory,
} = require("../controllers/game/kid/KidInventoryController.js")

const verifyParentToken = require("../middleware/verifyParentToken.js")
const verifyKidToken = require("../middleware/verifyKidToken.js")
const kidRegisterValidator = require("../validator/kidRegisterValidator.js")

const router = express.Router()

router.post("/login", login)
router.post("/register", verifyParentToken, kidRegisterValidator, register)
router.get("/profile", verifyKidToken, kid.profile)
router.post("/update", verifyKidToken, kid.updateProfile)

// kid inventory
router.get("/inventory", verifyKidToken, loadKidInventory)

module.exports = router
