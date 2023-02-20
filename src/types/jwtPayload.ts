import { Types } from 'mongoose'
import { UserRoles } from 'types'

export interface JwtPayload {
    userId: Types.ObjectId;
    emailAdd: string;
    role: UserRoles;
}