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

router.get('/dashboard/:quizId', isOnboard, hasEditAccess, checkQuizController.getCheckingDashboard)
router.get('/dashboard/:quizId/:searchQuery', isOnboard, hasEditAccess, checkQuizController.getCheckingDashboard)
router.patch('/autocheck/:quizId', isOnboard, isQuizAdmin, checkQuizController.autoCheck)

router.patch('/leaderboard/:quizId', isOnboard, isQuizAdmin, checkQuizController.generateLeaderBoard)
router.patch('/leaderboard/:quizId/:searchQuery', isOnboard, isQuizAdmin, checkQuizController.generateLeaderBoard)

router.get('/sectionLeaderboard/:quizId/:sectionIndex', isOnboard, hasEditAccess, checkQuizController.getCheckingSection)
router.get('/sectionLeaderboard/:quizId/:sectionIndex/:searchQuery', isOnboard, hasEditAccess, checkQuizController.getCheckingSection)
router.patch('/generateSectionLeaderboard/:quizId/:sectionIndex', isOnboard, isQuizAdmin, checkQuizController.generateSectionLeaderboard);
router.patch('/generateSectionLeaderboard/:quizId/:sectionIndex/:searchQuery', isOnboard, isQuizAdmin, checkQuizController.generateSectionLeaderboard);


export default router
