import express from 'express'

import { login, register } from '../controllers/parent/ParentAuthController.js'
import { parentRegisterValidator } from '../validator/parentRegisterValidator.js'
import Kid from './kid.js'
import Parent from './parent.js'

import verifyToken from '../middleware/verifyParentToken.js'
const router = express.Router()


// parent auth routes
router.post('/login', login)
router.post('/register', parentRegisterValidator, register)

router.use('/parent', verifyToken, Parent)
router.use('/kid', Kid)


export default router;