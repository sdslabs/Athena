import { Schema } from 'mongoose'
import { IUser, OAuthProviders, SocialHandleTypes, UserRoles } from 'types'

const userSchema = new Schema<IUser>({
  personalDetails: {
    name: {
      type: String,
      required: true,
    },
    emailAdd: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: false,
    },
  },
  educationalDetails: {
    instituteName: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  socialHandles: [
    {
      type: {
        type: String,
        required: true,
        enum: Object.values(SocialHandleTypes),
      },
      handle: {
        type: String,
        required: true,
      },
    },
  ],
  onboardingComplete: {
    type: Boolean,
    required: true,
    default: false,
  },
  oauthProvider: {
    type: String,
    required: true,
    enum: Object.values(OAuthProviders),
  },
  token: {
    type: String,
  },
  csrfToken: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    enum: Object.values(UserRoles),
    default: UserRoles.user,
  },
})

export default userSchema
