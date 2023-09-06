import express from 'express'
import responseRouter from './response'
import quizRouter from './quiz'
import userRouter from './user'

const router = express.Router();

router.use('/response', responseRouter)
router.use('/user', userRouter);
router.use('/quiz', quizRouter);

export default router