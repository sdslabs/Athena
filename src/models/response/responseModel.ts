import mongoose from 'mongoose'
import { IResponse, ModelNames } from 'types'
import responseSchema from './responseSchema'

const ResponseModel = mongoose.model<IResponse>(ModelNames.Response, responseSchema)

export default ResponseModel
