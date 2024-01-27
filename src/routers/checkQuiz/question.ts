import express from 'express'
import hasEditAccess from '@utils/hasEditAccess'
import isOnboard from '@utils/isOnboard'
import * as questionController from '@controllers/checkQuiz/question'

const router = express.Router()

router.put('/:quizId/:questionId', isOnboard, hasEditAccess, questionController.addAssignee)
router.patch('/:quizId/:questionId', isOnboard, hasEditAccess, questionController.removeAssignee)

export default router