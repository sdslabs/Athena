import express from 'express'
import * as questionController from '@controllers/question'
import { hasEditAccess } from '@utils/hasEditAccess'
import { isAuth } from '@utils/isAuth'

const router = express.Router()

router.post('/:quizId', isAuth, hasEditAccess, questionController.createQuestion)
router.get('/:questionId', isAuth, hasEditAccess, questionController.getQuestions)
router.put('/:questionId', isAuth, hasEditAccess, questionController.updateQuestion)
router.delete('/:questionId', isAuth, hasEditAccess, questionController.deleteQuestion)

export default router