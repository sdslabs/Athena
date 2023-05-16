import express from 'express'
import * as questionController from '@controllers/question'
import hasEditAccess from '@utils/hasEditAccess'
import isAuth from '@utils/isAuth'

const router = express.Router()

router.post('/:quizId', isAuth, hasEditAccess, questionController.createQuestion)
router.get('/:questionId', isAuth, questionController.getQuestions)
router.put('/:quizId', isAuth, hasEditAccess, questionController.updateQuestion)
router.delete('/:quizId', isAuth, hasEditAccess, questionController.deleteQuestion)

export default router