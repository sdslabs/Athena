import express from 'express'
import * as quizController from '@controllers/quiz'

const router = express.Router()

router.post('/create', quizController.createQuiz)
router.post('/update/:quizId', quizController.updateQuiz)

export default router
