import { Schema } from 'mongoose'
import { ModelNames, IQuiz } from 'types'

const quizSchema = new Schema<IQuiz>({
  admin: {
    type: Schema.Types.ObjectId,
    ref: ModelNames.User,
    required: true,
  },
  managers: [
    {
      type: Schema.Types.ObjectId,
      ref: ModelNames.User,
    },
  ],
  participants: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: ModelNames.User,
      },
      submitted: {
        type: Boolean,
        default: false,
      },
      isGivingQuiz: {
        type: Boolean,
        default: false,
      },
      time: {
        started: {
          type: Date,
          default: null,
        },
        left: {
          type: Date,
          default: null,
        },
      },
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
      type: Date,
      required: true,
    },
    endDateTimestamp: {
      type: Date,
      required: true,
    },
    accessCode: {
      type: String,
    },
    bannerImage: {
      type: String,
      required: false,
    },
  },
  registrationMetadata: {
    customFields: [
      {
        name: {
          type: String,
          required: true,
        },
        label: {
          type: String,
          required: true,
        },
        isRequired: {
          type: Boolean,
          required: true,
        },
      },
    ],
  },
  sections: [
    {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      questions: [{ type: Schema.Types.ObjectId, ref: ModelNames.Question }],
    },
  ],
})

export default quizSchema
