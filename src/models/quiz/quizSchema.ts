import { Schema } from 'mongoose'
import { IQuiz } from '@types'

const quizSchema = new Schema<IQuiz>({
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  managers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  isPublished: {
    type: Boolean,
    required: true,
    default: false,
  },
  isAcceptingAnswers: {
    type: Boolean,
    required: true,
    default: false,
  },
  resultsPublished: {
    type: Boolean,
    required: true,
    default: false,
  },
  quizMetadata: {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructions: {
      type: String,
      required: true,
    },
    startDateTimestamp: {
      type: Number,
      required: true,
    },
    endDateTimestamp: {
      type: Number,
      required: true,
    },
    accessCode: {
      type: String,
      required: false,
    },
    bannerImage: {
      type: String,
      required: false,
    },
  },
})

export default quizSchema
