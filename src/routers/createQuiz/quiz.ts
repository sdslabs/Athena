import express from 'express'
import * as quizController from '@controllers/createQuiz/quiz'
import isAuth from '@utils/isAuth'
import hasEditAccess from '@utils/hasEditAccess'
import isAdmin from '@utils/isAdmin'
import isOnboard from '@utils/isOnboard'

const router = express.Router()

router.post('/create', isOnboard, isAdmin, quizController.createQuiz)
router.put('/update/:quizId', isOnboard, hasEditAccess, quizController.updateQuiz)
router.patch('/publish/:quizId', isOnboard, hasEditAccess, quizController.publishQuiz)
router.delete('/delete/:quizId', isOnboard, hasEditAccess, quizController.deleteQuiz)
router.get('/:quizId', isAuth, quizController.quizGet)


export default router
