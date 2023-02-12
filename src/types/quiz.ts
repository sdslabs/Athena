import { Types } from 'mongoose'
import { IQuestion } from './question'

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
    startDateTimestamp: Date
    endDateTimestamp: Date
    accessCode?: string
    bannerImage?: string
  }
  registrationMetadata?: {
    customFields: {
      name: string
      label: string
      isRequired: boolean
    }[]
  }
  sections?: {
    name: string
    description?: string
    questions?: IQuestion[]
  }[]
}
