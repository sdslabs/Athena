import { Schema } from 'mongoose'
import { IResponse, ModelNames, ResponseStatus } from 'types'

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
  selectedOptionId: [
    {
      type: String,
      required: true,
    },
  ],
  subjectiveAnswer: {
    type: String,
  },
  marksAwarded: {
    type: Number,
  },
  status: {
    type: String,
    enum: Object.values(ResponseStatus),
  },
  checkedBy: {
    type: Schema.Types.ObjectId,
    ref: ModelNames.User,
  },
})

export default responseSchema
