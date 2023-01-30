import { IQuiz, ModelNames } from '@types'
import mongoose from 'mongoose'
import quizSchema from './quizSchema'

const QuizModel = mongoose.model<IQuiz>(ModelNames.Quiz, quizSchema)

export default QuizModel
