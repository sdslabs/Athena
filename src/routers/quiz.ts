import express from 'express'
import * as quizController from '@controllers/quiz'
import * as sectionController from '@controllers/section'
import { isAuth } from '@utils/isAuth'

const router = express.Router()

router.post('/create', isAuth, quizController.createQuiz)

export default router
