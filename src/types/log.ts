import { Types, Date } from 'mongoose'

export interface ILog {
  _id?: Types.ObjectId
  quizId: Types.ObjectId
  userId: Types.ObjectId
  questionId?: Types.ObjectId
  logType: LogType
  timestamp: Date
  location?: {
    longitude: number
    latitude: number
  }
  key?: string
  ip?: string
}

export enum LogType {
  JoinQuiz = 'joinQuiz',
  LeftQuiz = 'leftQuiz',
  ServerDisconnect = 'server namespace disconnect',
  TabSwitch = 'tabSwitch',
  SusKey = 'susKey',
  RightClick = 'rightClick',
  IP = 'ip',
  Location = 'locationAccess',
  FullScreenExit = 'fullScreenExit',
}
