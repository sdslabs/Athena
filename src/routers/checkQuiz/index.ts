import express from 'express'
import * as checkQuizController from '@controllers/checkQuiz'
import questionRouter from './question'
import responseRouter from './response'
import hasEditAccess from '@utils/hasEditAccess'
import isOnboard from '@utils/isOnboard'
import isQuizAdmin from '@utils/isQuizAdmin'

const router = express.Router()

router.use('/question', questionRouter);
router.use('/response', responseRouter);

router.get('/dashboard/:quizId', checkQuizController.getCheckingDashboard)
router.patch('/autocheck/:quizId', checkQuizController.autoCheck);
router.patch('/leaderboard/:quizId', checkQuizController.generateLeaderBoard);

export default router