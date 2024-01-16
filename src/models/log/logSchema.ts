import { Schema } from "mongoose"
import { ModelNames, ILog, LogType } from "types"

const logSchema = new Schema<ILog>({
  quizId: {
    type: Schema.Types.ObjectId,
    ref: ModelNames.Quiz,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: ModelNames.User,
    required: true,
  },
  questionId: {
    type: Schema.Types.ObjectId,
    ref: ModelNames.Question,
    required: true,
  },
  logType: {
    type: String,
    enum: Object.values(LogType),
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
})

export default logSchema