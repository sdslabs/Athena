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

router.get('/dashboard/:quizId', isOnboard, hasEditAccess, checkQuizController.getCheckingDashboard)
router.patch('/autocheck/:quizId', isOnboard, isQuizAdmin, checkQuizController.autoCheck);
router.patch('/leaderboard/:quizId', isOnboard, isQuizAdmin, checkQuizController.generateLeaderBoard);

export default router