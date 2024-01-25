import express from 'express'
import * as responseController from '@controllers/giveQuiz/response'
import isAuth from '@utils/isAuth'

const router = express.Router();

router.get('/:quizId/:questionId/', isAuth, responseController.getResponse)
router.post('/:quizId/:questionId/', isAuth, responseController.createOrUpdateResponse)
router.delete('/:quizId/:questionId/', isAuth, responseController.deleteResponse)


export default router