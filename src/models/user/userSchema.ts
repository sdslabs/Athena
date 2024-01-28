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
  profileImage: {
    type: String,
    required: false,
  },
  educationalDetails: {
    instituteName: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
  },
  socialHandles: [
    {
      type: {
        type: String,
        required: false,
        enum: Object.values(SocialHandleTypes),
      },
      handle: {
        type: String,
        required: false,
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
