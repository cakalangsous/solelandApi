import express from "express"
import { profile } from "../controllers/game/parent/ParentController.js"
const router = express.Router()

router.get("/profile", profile)

export default router
