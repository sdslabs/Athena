import express from 'express'
import * as checkQuizController from '@controllers/checkQuiz'
import questionRouter from './question'
import responseRouter from './response'
import hasEditAccess from '@utils/hasEditAccess'
import isQuizAdmin from '@utils/isQuizAdmin'
import isOnboard from '@utils/isOnboard'

const router = express.Router()

router.use('/question', questionRouter)
router.use('/response', responseRouter)

router.get('/dashboard/:quizId', checkQuizController.getCheckingDashboard)
router.get('/sectionLeaderboard/:quizId/:sectionIndex', checkQuizController.getCheckingSection)
router.patch('/autocheck/:quizId', checkQuizController.autoCheck);
router.patch('/leaderboard/:quizId', checkQuizController.generateLeaderBoard);
router.patch('/generateSectionLeaderboard/:quizId/:sectionIndex', checkQuizController.generateSectionLeaderboard);


export default router
