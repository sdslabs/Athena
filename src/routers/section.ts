import express from 'express'
import * as sectionController from '@controllers/section'

const router = express.Router()

router.post('/:quizId/section', sectionController.createSection)
router.delete('/sections/:sectionID', sectionController.deleteSection)
router.get('/sections/:sectionId', sectionController.getSectionById)
router.put('/sections/:sectionId', sectionController.updateSectionByID)


export default router
