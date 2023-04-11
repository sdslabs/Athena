  import express from 'express'
import * as sectionController from '@controllers/section'

const router = express.Router()

router.post('/:quizId', sectionController.createSection)
router.delete('/:quizId', sectionController.deleteSection)
router.get('/:quizId', sectionController.getSection)
router.put('/:quizId', sectionController.updateSection)

export default router
