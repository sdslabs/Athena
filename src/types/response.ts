import { Types } from 'mongoose'

export interface IResponse {
  questionId: Types.ObjectId
  quizId: Types.ObjectId
  userId: Types.ObjectId
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
