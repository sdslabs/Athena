import express from 'express'
import * as authController from '@controllers/auth'

const router = express.Router()

router.get('/google', authController.getGoogleAuth)
router.get('/github', authController.getGithubAuth)
router.get('/google/callback', authController.googleCallback);
router.get('/github/callback', authController.githubCallback);

export default router