const express = require("express")
const parent = require("../controllers/parent/ParentController.js")
const { kidRegister, getKids } = require("../controllers/parent/KidsController")
const verifyParentToken = require("../middleware/verifyParentToken.js")
const kidRegisterValidator = require("../validator/kidRegisterValidator.js")

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
    confirm,
} = require("../controllers/parent/ParentAuthController.js")

const router = express.Router()

router.post("/login", login)
router.post("/register", parentRegisterValidator, register)
router.post("/forgot-password", forgotPassword)
router.post("/email-confirm/:emailVerifyToken", confirm)
router.get("/token", refreshToken)

// protected routes
router.get("/profile", verifyParentToken, parent.profile)
router.get("/kids", verifyParentToken, getKids)
router.post("/kids", verifyParentToken, kidRegisterValidator, kidRegister)

router.delete("/logout", verifyParentToken, logout)

module.exports = router
