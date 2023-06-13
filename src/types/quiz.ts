import { Date, Types } from 'mongoose'
import { IQuestion } from './question'

interface participant {
  user: Types.ObjectId
  submitted: boolean
  isGivingQuiz: boolean
  time: {
    started: Date
    left: Date
  }
}

export interface IQuiz {
  admin: Types.ObjectId
  managers?: Types.ObjectId[]
  participants?: participant[]
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
