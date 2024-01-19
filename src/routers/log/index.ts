import express from 'express'
import createLog from '@controllers/createLog'
import isOnboard from '@utils/isOnboard'

const router = express.Router()

router.post('/', isOnboard, createLog)

export default router