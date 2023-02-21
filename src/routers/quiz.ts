import express from 'express'
import * as quizController from '@controllers/quiz'
import * as sectionController from '@controllers/section'

const router = express.Router()

router.post('/create', quizController.createQuiz)

export default router
