import express from 'express'
import * as quizController from '@controllers/quiz'

const router = express.Router()

router.post('/create', quizController.createQuiz)

export default router
