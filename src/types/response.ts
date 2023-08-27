import { Types } from 'mongoose'
import { IUser } from './user'

export interface IResponse {
  questionId: Types.ObjectId
  quizId: Types.ObjectId
  user: IUser
  selectedOptionId?: string
  subjectiveAnswer?: string
  marksAwarded?: number
  checkedBy?: Types.ObjectId
  status: ResponseStatus
}

export enum ResponseStatus {
  unanswered = 'unanswered',
  answered = 'answered',
  checked = 'checked',
  markedanswer = 'marked-answered',
  marked = 'marked',
}
