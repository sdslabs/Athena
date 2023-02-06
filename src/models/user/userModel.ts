import mongoose from 'mongoose'
import { IUser, ModelNames } from 'types'
import userSchema from './userSchema'

const userModel = mongoose.model<IUser>(ModelNames.User, userSchema)

export default userModel
