import express from 'express'
import * as sectionController from '@controllers/createQuiz/section'
import hasEditAccess from '@utils/hasEditAccess'
import isOnboard from '@utils/isOnboard'

const router = express.Router()

router.post('/:quizId', isOnboard, hasEditAccess, sectionController.createSection)
router.delete('/:quizId/:sectionIndex', isOnboard, hasEditAccess, sectionController.deleteSection)
router.get('/:quizId', isOnboard, sectionController.getSection)
router.put('/:quizId', isOnboard, hasEditAccess, sectionController.updateSection)

export default router
