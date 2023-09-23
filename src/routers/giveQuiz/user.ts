import express from 'express'
import * as userController from '@controllers/giveQuiz/user'
import isOnboard from '@utils/isOnboard';

const router = express.Router();

router.post('/register/:quizId', isOnboard, userController.registerQuiz)
router.get('/start/:quizId', isOnboard, userController.startQuiz)

export default router;