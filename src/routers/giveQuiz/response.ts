import express from 'express'
import * as responseController from '@controllers/giveQuiz/response'
import isOnboard from '@utils/isOnboard'

const router = express.Router()

router.get('/:quizId/:questionId/', isOnboard, responseController.getResponse)
router.post('/:quizId/:questionId/', isOnboard, responseController.createOrUpdateResponse)
router.delete('/:quizId/:questionId/', isOnboard, responseController.deleteResponse)

export default router
