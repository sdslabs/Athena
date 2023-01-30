import { Types } from 'mongoose'

export interface IQuiz {
  admin: Types.ObjectId
  managers?: Types.ObjectId[]
  participants?: Types.ObjectId[]
  isPublished: boolean
  isAcceptingAnswers: boolean
  resultsPublished: boolean
  quizMetadata?: {
    name: string
    description: string
    instructions: string
    startDateTimestamp: number
    endDateTimestamp: number
    accessCode?: string
    bannerImage?: string
  }
}
