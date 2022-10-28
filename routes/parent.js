const express = require("express")
const parent = require("../controllers/parent/ParentController.js")
const { getKids } = require("../controllers/parent/KidsController")
const verifyParentToken = require("../middleware/verifyParentToken.js")
const {
    refreshToken,
} = require("../controllers/parent/RefreshTokenController.js")
const {
    parentRegisterValidator,
} = require("../validator/parentRegisterValidator.js")

const {
    login,
    register,
    logout,
    forgotPassword,
} = require("../controllers/parent/ParentAuthController.js")

const router = express.Router()

router.post("/login", login)
router.post("/register", parentRegisterValidator, register)
router.post("/forgot-password", forgotPassword)
router.get("/token", refreshToken)

// protected routes
router.get("/profile", verifyParentToken, parent.profile)
router.get("/kids", verifyParentToken, getKids)

router.delete("/logout", verifyParentToken, logout)

module.exports = router
