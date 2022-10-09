import express from 'express'

import { login, register } from '../controllers/kid/KidAuthController.js'
import verifyParentToken from '../middleware/verifyParentToken.js'
import { kidRegisterValidator } from '../validator/kidRegisterValidator.js'
const router = express.Router()

router.post('/login', login)
router.post('/register', verifyParentToken, kidRegisterValidator, register)


export default router;