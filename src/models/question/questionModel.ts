import mongoose from 'mongoose'
import { ModelNames, IQuestion } from 'types'
import questionSchema from './questionSchema'

const QuestionModel = mongoose.model<IQuestion>(ModelNames.Question, questionSchema)

export default QuestionModel
