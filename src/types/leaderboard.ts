import { Types } from 'mongoose'

export interface ILeaderboard {
  id: Types.ObjectId
  quizId: Types.ObjectId
  participants?: Types.ObjectId[]
  leaderboardParticipants?: {
    id: string
    userId: string
    score: number
    questionsAttempted: number
    questionsChecked: number
  }
}

