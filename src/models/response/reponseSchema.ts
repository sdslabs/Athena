import { Schema } from 'mongoose'
import { IResponse, ModelNames } from 'types'

const responseSchema = new Schema<IResponse>({
  questionId: {
    type: Schema.Types.ObjectId,
    ref: ModelNames.Question,
    required: true,
  },
  quizId: {
    type: Schema.Types.ObjectId,
    ref: ModelNames.Quiz,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: ModelNames.User,
    required: true,
  },
  selectedOptionId: {
    type: String,
  },
  subjectiveAnswer: {
    type: String,
  },
  marksAwarded: {
    type: Number,
  },
  checkedBy: {
    type: Schema.Types.ObjectId,
    ref: ModelNames.User,
  },
})

export default responseSchema
