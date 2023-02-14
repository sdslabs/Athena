import express from 'express'
import * as authController from '@controllers/auth'

const router = express.Router()

router.get('/google', authController.getAuth)
router.get('/google/callback', authController.callback);

export default router