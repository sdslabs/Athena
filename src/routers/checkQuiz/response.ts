import express from 'express'
import * as responseController from '@controllers/checkQuiz/response'
import hasEditAccess from '@utils/hasEditAccess'
import isOnboard from '@utils/isOnboard'

const router = express.Router()

router.get('/responses/:quizId/:questionId', responseController.getAllResponses)
router.post('/check/:quizId/:responseId', responseController.checkResponse);
router.get('/getResponse/:responseId', responseController.getResponse)

export default router