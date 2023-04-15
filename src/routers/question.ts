import express from 'express'
import * as questionController from '@controllers/question'

const router = express.Router()

router.post('/:quizId', questionController.createQuestion)
router.get('/:questionId', questionController.getQuestions)
router.put('/:questionId', questionController.updateQuestion)
router.delete('/:questionId', questionController.deleteQuestion)

export default router