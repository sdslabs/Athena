import express from 'express'
import * as questionController from '@controllers/createQuiz/question'
import hasEditAccess from '@utils/hasEditAccess'
import isOnboard from '@utils/isOnboard'

const router = express.Router()

router.post('/:quizId', isOnboard, hasEditAccess, questionController.createQuestion)
router.get('/:questionId', isOnboard, questionController.getQuestions)
router.put('/:quizId', isOnboard, hasEditAccess, questionController.updateQuestion)
router.delete('/:quizId', isOnboard, hasEditAccess, questionController.deleteQuestion)

export default router