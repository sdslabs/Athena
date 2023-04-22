import { Schema } from 'mongoose'
import { ILeaderboard, ModelNames } from 'types'

const leaderboardSchema = new Schema<ILeaderboard>({
  participants: {
    type: Schema.Types.ObjectId,
    ref: ModelNames.Question,
    required: true,
  },
  quizId: {
    type: Schema.Types.ObjectId,
    ref: ModelNames.Quiz,
    required: true,
  },
  id: {
    type: Schema.Types.ObjectId,
    ref: ModelNames.Quiz,
    required: true,
  },
  leaderboardParticipants: {
    id: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    questionsAttempted: {
      type: Number,
      required: true,
    },
    questionsChecked: {
      type: Number,
      required: true,
    },
  }
})

export default leaderboardSchema