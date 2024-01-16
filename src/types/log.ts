import { Types, Date } from "mongoose";

export interface ILog {
  _id?: Types.ObjectId,
  quizId: Types.ObjectId,
  userId: Types.ObjectId,
  questionId: Types.ObjectId,
  logType: LogType,
  timestamp: Date,
}

export enum LogType {
  JoinQuiz = 'joinQuiz',
  LeftQuiz = 'leftQuiz',
  ServerDisconnect = 'server namespace disconnect',
  TabSwitch = 'tabSwitch',
  SusKey = 'susKey',
  RightClick = 'rightClick',
  IP = 'ip',
}