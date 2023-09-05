import express from 'express'
import * as checkQuizController from '@controllers/checkQuiz'
import hasEditAccess from '@utils/hasEditAccess'
import isOnboard from '@utils/isOnboard'
import isQuizAdmin from '@utils/isQuizAdmin'

const router = express.Router()


router.get('/dashboard/:quizId', isOnboard, hasEditAccess, checkQuizController.getDashboard)
router.put('/assign/:quizId/:questionId', isOnboard, hasEditAccess, checkQuizController.addAssignee)
router.put('/unassign/:quizId/:questionId', isOnboard, hasEditAccess, checkQuizController.removeAssignee)
router.get('/reponses/:quizId/:questionId', isOnboard, hasEditAccess, checkQuizController.getAllResponses)
router.patch('/check/:quizId/:reponseId', isOnboard, hasEditAccess, checkQuizController.checkResponse);
router.patch('/autocheck/:quizId', isOnboard, isQuizAdmin, checkQuizController.autoCheck);
router.patch('/leaderboard/:quizId', isOnboard, isQuizAdmin, checkQuizController.generateLeaderBoard);
router.get('/getResponse/:responseId', isOnboard, hasEditAccess, checkQuizController.getResponse)

export default router