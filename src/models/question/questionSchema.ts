import { Schema } from 'mongoose'
import { IQuestion, ModelNames, QuestionTypes } from '@types'

const questionSchema = new Schema<IQuestion>({
  type: {
    type: String,
    required: true,
    enum: [QuestionTypes.MCQ, QuestionTypes.SUBJECTIVE],
    default: QuestionTypes.MCQ,
  },
  description: {
    type: String,
    required: true,
  },
  options: [
    {
      id: {
        type: String,
        required: true,
      },
      label: {
        type: String,
        required: true,
      },
    },
  ],
  correctAnswer: {
    type: String,
  },
  maxMarks: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
  },
  autoCheck: {
    type: Boolean,
    required: true,
    default: true,
  },
  totalAttempts: {
    type: Number,
    default: 0,
  },
  checkedAttempts: {
    type: Number,
    default: 0,
  },
  assignedTo: [
    {
      type: Schema.Types.ObjectId,
      ref: ModelNames.User,
    },
  ],
})

export default questionSchema
