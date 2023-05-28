import express from 'express'
import * as sectionController from '@controllers/section'
import isAuth from '@utils/isAuth'
import hasEditAccess from '@utils/hasEditAccess'
import isOnboard from '@utils/isOnboard'

const router = express.Router()

router.post('/:quizId', isOnboard, hasEditAccess, sectionController.createSection)
router.delete('/:quizId', isOnboard, hasEditAccess, sectionController.deleteSection)
router.get('/:quizId', isOnboard, sectionController.getSection)
router.put('/:quizId', isOnboard, hasEditAccess, sectionController.updateSection)

export default router
