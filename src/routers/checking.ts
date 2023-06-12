import express from 'express'
import * as checkingController from '@controllers/checking'
import hasEditAccess from '@utils/hasEditAccess'
import isOnboard from '@utils/isOnboard'

const router = express.Router()


router.get('/dashboard/:quizId', isOnboard, hasEditAccess, checkingController.getDashboard)
router.put('/assign/:quizId/:questionId', isOnboard, hasEditAccess, checkingController.addAssignee)
router.put('/unassign/:quizId/:questionId', isOnboard, hasEditAccess, checkingController.removeAssignee)


export default router