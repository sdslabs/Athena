import { Types } from 'mongoose'

export interface IUser {
  _id?: Types.ObjectId
  personalDetails?: {
    name: string
    emailAdd: string
    phoneNo: string
  }
  profileImage: string
  educationalDetails?: {
    instituteName?: string
    city?: string
    country?: string
  }
  socialHandles?: {
    type?: SocialHandleTypes
    handle?: string
  }[]
  onboardingComplete: boolean
  oauthProvider: OAuthProviders
  token?: string
  csrfToken?: string
  role: UserRoles
}

export enum SocialHandleTypes {
  facebook = 'facebook',
  twitter = 'twitter',
  linkedin = 'linkedin',
  github = 'github',
  instagram = 'instagram',
  youtube = 'youtube',
  codechef = 'codechef',
  codeforces = 'codeforces',
  hackerrank = 'hackerrank',
  hackerearth = 'hackerearth',
  leetcode = 'leetcode',
  behance = 'behance',
  dribbble = 'dribbble',
}

export enum OAuthProviders {
  google = 'google',
  github = 'github',
}

export enum UserRoles {
  superAdmin = 'superAdmin',
  admin = 'admin',
  manager = 'manager',
  user = 'user',
}
