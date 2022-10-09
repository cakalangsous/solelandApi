import express from "express"

import { login, register } from "../controllers/game/kid/KidAuthController.js"
import {
    profile,
    updateProfile,
} from "../controllers/game/kid/KidController.js"
import { loadKidInventory } from "../controllers/game/kid/KidInventoryController.js"

import verifyParentToken from "../middleware/verifyParentToken.js"
import verifyKidToken from "../middleware/verifyKidToken.js"
import { kidRegisterValidator } from "../validator/kidRegisterValidator.js"

const router = express.Router()

router.post("/login", login)
router.post("/register", verifyParentToken, kidRegisterValidator, register)
router.get("/profile", verifyKidToken, profile)
router.post("/update", verifyKidToken, updateProfile)

// kid inventory
router.get("/inventory", verifyKidToken, loadKidInventory)

export default router
