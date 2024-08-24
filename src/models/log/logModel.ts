import mongoose from 'mongoose'
import { ModelNames, ILog } from 'types'
import logSchema from './logSchema'

const LogModel = mongoose.model<ILog>(ModelNames.Log, logSchema)

export default LogModel
