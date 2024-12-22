import express from 'express'
import * as userController from '@controllers/giveQuiz/user'
import isOnboard from '@utils/isOnboard'

const router = express.Router()

router.post('/register/:quizId', isOnboard, userController.registerQuiz)
router.post('/start/:quizId', isOnboard, userController.startQuiz)
router.post('/submit/:quizId', isOnboard, userController.submitQuiz)
router.get('/getStartTime/:quizId', isOnboard, userController.getStartTime)

export default router
