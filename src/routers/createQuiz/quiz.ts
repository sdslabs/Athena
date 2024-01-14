import express from 'express'
import * as quizController from '@controllers/createQuiz/quiz'
import isAuth from '@utils/isAuth'
import hasEditAccess from '@utils/hasEditAccess'
import isAdmin from '@utils/isAdmin'
import isOnboard from '@utils/isOnboard'

const router = express.Router()

router.post('/host', isOnboard, isAdmin, quizController.hostQuiz)
router.put('/:quizId', isOnboard, hasEditAccess, quizController.updateQuiz)
router.patch('/:quizId', isOnboard, hasEditAccess, quizController.publishQuiz)
router.delete('/:quizId', isOnboard, hasEditAccess, quizController.deleteQuiz)
router.get('/:quizId', isAuth, quizController.quizGet)


export default router
