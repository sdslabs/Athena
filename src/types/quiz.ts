import { Date, Types } from 'mongoose'
import { IQuestion } from './question'

export interface IParticipant {
  userId: Types.ObjectId
  submitted: boolean
  registrationData: {
    customFields: {
      name: string
      value: string
    }[]
  }
  startTime: number
    // enterQuiz: number
    // left: number
    // endQuiz: number
  // }
}

export interface IQuiz {
  _id?: Types.ObjectId
  admin: Types.ObjectId
  managers?: Types.ObjectId[]
  participants?: IParticipant[]
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
    instructions?: string
    questions?: IQuestion[]
  }[]
}

export enum QuizCode {
  JoinQuiz = 'joinQuiz',
  LeftQuiz = 'leftQuiz',
  ServerDisconnect = 'server namespace disconnect',
}

export enum QuizUserStatus {
  QUIZ_NOT_ACCEPTING_ANSWERS,
  QUIZ_NOT_STARTED,
  USER_NOT_STARTED,
  USER_IS_GIVING_QUIZ,
  SUBMITTED,
  AUTO_SUBMIT_QUIZ,
}