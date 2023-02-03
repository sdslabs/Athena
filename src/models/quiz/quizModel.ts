import mongoose from 'mongoose'
import { ModelNames, IQuiz } from 'types'
import quizSchema from './quizSchema'

const QuizModel = mongoose.model<IQuiz>(ModelNames.Quiz, quizSchema)

export default QuizModel
