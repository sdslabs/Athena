import express from 'express'
import * as quizController from '@controllers/quiz'
import isAuth from '@utils/isAuth'
import hasEditAccess from '@utils/hasEditAccess'
import isAdmin from '@utils/isAdmin'

const router = express.Router()

router.post('/create', isAuth, isAdmin, quizController.createQuiz)
router.put('/update/:quizId', isAuth, hasEditAccess, quizController.updateQuiz)
router.patch('/publish/:quizId', isAuth, hasEditAccess, quizController.publishQuiz)
router.delete('/delete/:quizId', isAuth, hasEditAccess, quizController.deleteQuiz)

export default router
