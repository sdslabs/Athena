import express from 'express'
import * as sectionController from '@controllers/section'
import isAuth from '@utils/isAuth'

const router = express.Router()

router.post('/:quizId', isAuth, sectionController.createSection)
router.delete('/:quizId', isAuth, sectionController.deleteSection)
router.get('/:quizId', isAuth, sectionController.getSection)
router.put('/:quizId', isAuth, sectionController.updateSection)

export default router
