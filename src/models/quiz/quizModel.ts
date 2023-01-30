import { IQuiz } from '@types'
import mongoose from 'mongoose'
import quizSchema from './quizSchema'

const QuizModel = mongoose.model<IQuiz>('Quiz', quizSchema)

export default QuizModel
