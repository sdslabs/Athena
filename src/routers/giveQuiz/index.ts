import express from 'express'
import responseRouter from './response'

const router = express.Router();

router.use('/response', responseRouter)

export default router