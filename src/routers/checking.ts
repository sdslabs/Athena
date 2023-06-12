import express from 'express'
import * as checkingController from '@controllers/checking'
import hasEditAccess from '@utils/hasEditAccess'
import isOnboard from '@utils/isOnboard'

const router = express.Router()


router.get('/dashboard/:quizId', isOnboard, hasEditAccess, checkingController.getDashboard)


export default router