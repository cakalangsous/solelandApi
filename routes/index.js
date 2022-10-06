import express from 'express'

import { login, register } from '../controllers/parent/ParentAuthController.js'
import { parentRegisterValidator } from '../validator/validator.js'
import Kid from './kid.js'
const router = express.Router()


// parent auth routes
router.post('/login', login)
router.post('/register', parentRegisterValidator, register)


router.use('/kid', Kid)


export default router;