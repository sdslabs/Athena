import { Types } from 'mongoose'

export interface IQuestion {
  type: QuestionTypes
  description: string
  options?: {
    id: string
    label: string
  }[]
  correctAnswer?: string
  maxMarks: number
  notes?: string
  autoCheck: boolean
  totalAttempts?: number
  checkedAttempts?: number
  assignedTo?: Types.ObjectId[]
}

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

export enum ModelNames {
  Quiz = 'Quiz',
  User = 'User',
  Question = 'Question',
}

export enum QuestionTypes {
  MCQ = 'mcq',
  SUBJECTIVE = 'subjective',
}