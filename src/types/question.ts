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

export enum QuestionTypes {
  MCQ = 'mcq',
  SUBJECTIVE = 'subjective',
}
