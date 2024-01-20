import express from 'express';
import * as quizController from '@controllers/giveQuiz/quiz'
import isOnboard from '@utils/isOnboard';

const router = express.Router();

router.get('/quiz/:quizId', isOnboard, quizController.getQuiz)
router.get('/question/:questionId', isOnboard, quizController.getQuestion)

export default router;