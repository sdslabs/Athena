import express from 'express'
import * as checkingController from '@controllers/checking'
import hasEditAccess from '@utils/hasEditAccess'
import isOnboard from '@utils/isOnboard'
import isQuizAdmin from '@utils/isQuizAdmin'

const router = express.Router()


router.get('/dashboard/:quizId', isOnboard, hasEditAccess, checkingController.getDashboard)
router.put('/assign/:quizId/:questionId', isOnboard, hasEditAccess, checkingController.addAssignee)
router.put('/unassign/:quizId/:questionId', isOnboard, hasEditAccess, checkingController.removeAssignee)
router.get('/reponses/:quizId/:questionId', isOnboard, hasEditAccess, checkingController.getAllResponses)
router.patch('/check/:quizId/:reponseId', isOnboard, hasEditAccess, checkingController.checkResponse);
router.patch('/autocheck/:quizId', isOnboard, isQuizAdmin, checkingController.autoCheck);
router.patch('/leaderboard/:quizId', isOnboard, isQuizAdmin, checkingController.generateLeaderBoard);
router.get('/getResponse/:responseId', isOnboard, hasEditAccess, checkingController.getResponse)

export default router