import express from 'express'
import * as quizController from '@controllers/quiz'
import * as userController from '@controllers/user'
import isAuth from '@utils/isAuth'
import hasEditAccess from '@utils/hasEditAccess'
import isAdmin from '@utils/isAdmin'
import isOnboard from '@utils/isOnboard'

const router = express.Router()

// Quiz CRUD Routes
router.post('/create', isOnboard, isAdmin, quizController.createQuiz)
router.put('/update/:quizId', isOnboard, hasEditAccess, quizController.updateQuiz)
router.patch('/publish/:quizId', isOnboard, hasEditAccess, quizController.publishQuiz)
router.delete('/delete/:quizId', isOnboard, hasEditAccess, quizController.deleteQuiz)

// Quiz Get Routes
router.get('/:quizId', isOnboard, quizController.quizGet)
router.get('/', isOnboard, quizController.getAllQuizzes)

// User Quiz Routes
router.post('/register/:quizId', isOnboard, userController.registerQuiz)
router.get('/start/:quizId', isOnboard, userController.startQuiz)

export default router
