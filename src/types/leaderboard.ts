import { Types } from 'mongoose'

export interface ILeaderboard {
  _id?: Types.ObjectId
  quizId: Types.ObjectId
  participants: {
    userId: Types.ObjectId
    marks: number
    questionsAttempted: number
    questionsChecked: number
  }[]
}