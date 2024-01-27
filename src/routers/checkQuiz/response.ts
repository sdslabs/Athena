import express from 'express'
import * as responseController from '@controllers/checkQuiz/response'
import hasEditAccess from '@utils/hasEditAccess'
import isOnboard from '@utils/isOnboard'

const router = express.Router()

router.get('/:quizId/:questionId', isOnboard, hasEditAccess, responseController.getAllResponses)
router.patch('/check/:quizId/:responseId', isOnboard, hasEditAccess, responseController.checkResponse);
router.get('/response/:quizId/:responseId', isOnboard, hasEditAccess, responseController.getResponse)

export default router