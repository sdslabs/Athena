import express from 'express'
import * as sectionController from '@controllers/section'
import isAuth from '@utils/isAuth'
import hasEditAccess from '@utils/hasEditAccess'

const router = express.Router()

router.post('/:quizId', isAuth, hasEditAccess, sectionController.createSection)
router.delete('/:quizId', isAuth, hasEditAccess, sectionController.deleteSection)
router.get('/:quizId', isAuth, sectionController.getSection)
router.put('/:quizId', isAuth, hasEditAccess, sectionController.updateSection)

export default router
