import express from 'express'
import * as userController from '@controllers/giveQuiz/user'
import isOnboard from '@utils/isOnboard';

const router = express.Router();

router.post('/register/:quizId', isOnboard, userController.registerQuiz)
router.get('/start/:quizId', userController.startQuiz)
router.post('/submit/:quizId', userController.submitQuiz)

export default router;