import express from 'express'

import { login, register } from '../controllers/kid/KidAuthController.js'
import verifyParentToken from '../middleware/verifyParentToken.js'
const router = express.Router()

router.post('/login', login)
router.post('/register', verifyParentToken, register)


export default router;