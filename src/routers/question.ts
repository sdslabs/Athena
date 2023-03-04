import express from 'express'
import * as questionController from '@controllers/question'

const router = express.Router()

router.post('/question/:quizId/create', questionController.createQuestion)
router.get('/question/:questionId/get', questionController.getQuestions)
router.put('/question/:questionId/update', questionController.updateQuestion)
router.delete('/question/:questionId/delete', questionController.deleteQuestion)

export default router