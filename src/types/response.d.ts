import { Types } from 'mongoose'

export interface IResponse {
  questionId: Types.ObjectId
  quizId: Types.ObjectId
  userId: Types.ObjectId
  selectedOptionId?: string
  subjectiveAnswer?: string
  marksAwarded?: number
  checkedBy?: Types.ObjectId
}
