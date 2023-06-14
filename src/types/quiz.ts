import { Date, Types } from 'mongoose'
import { IQuestion } from './question'

interface participant {
  user: Types.ObjectId
  submitted: boolean
  isGivingQuiz: boolean
  registrationData: {
    customFields: {
      name: string
      value: string
    }[]
  }
  time: {
    started: number
    left: number
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
    duration: number
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
