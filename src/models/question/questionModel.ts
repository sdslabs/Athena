import mongoose from 'mongoose'
import { IQuestion, ModelNames } from '@types'
import questionSchema from './questionSchema'

const QuestionModel = mongoose.model<IQuestion>(ModelNames.Question, questionSchema)

export default QuestionModel
