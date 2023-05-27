import mongoose from 'mongoose'
import { IResponse, ModelNames } from 'types'
import responseSchema from './responseSchema'

const responseModel = mongoose.model<IResponse>(ModelNames.Response, responseSchema)

export default responseModel
