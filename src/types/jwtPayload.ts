import { Types } from 'mongoose'
import { UserRoles } from 'types'

export interface jwtPayload {
    userId: Types.ObjectId;
    emailAdd: string;
    role: UserRoles;
}