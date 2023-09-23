import express from 'express'
import hasEditAccess from '@utils/hasEditAccess'
import isOnboard from '@utils/isOnboard'
import * as questionController from '@controllers/checkQuiz/question'

const router = express.Router()

router.put('/assign/:quizId/:questionId', isOnboard, hasEditAccess, questionController.addAssignee)
router.put('/unassign/:quizId/:questionId', isOnboard, hasEditAccess, questionController.removeAssignee)

export default router