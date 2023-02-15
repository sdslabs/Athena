import { Request, Response } from 'express';
import { google } from 'googleapis';
import axios from 'axios';
import UserModel from '@models/user/userModel';
import { OAuthProviders, UserRoles, IUser, jwtPayload } from 'types';
import { createToken } from '@utils/token';
import { Types } from 'mongoose';

const googleCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
  );
  const { tokens } = await oauth2Client.getToken(code);

  try {
    const googleUser = await axios
      .get(
        `${process.env.GOOGLE_USER_URL}${tokens.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokens.id_token}`,
          },
        },
      );
    const user: IUser = await UserModel.findOne({ "personalDetails.emailAdd": googleUser.data.email, oauthProvider: OAuthProviders.google }) as IUser;
    let userId: Types.ObjectId;
    if (user) {
      userId = user._id as Types.ObjectId;
      console.log("user exists");
    }
    else {
      console.log("user does not exist");
      const newUser = new UserModel({
        oauthProvider: OAuthProviders.google,
        emailAdd: googleUser.data.email,
        personalDetails: {
          name: googleUser.data.name,
          emailAdd: googleUser.data.email,
          role: UserRoles.user,
        },
        educationalDetails: {
          instituteName: "ew",
          city: "er",
          country: "erew"
        }
      });
      const savedUser = await newUser.save();
      userId = savedUser._id;
    }

    const payload: jwtPayload = {
      userId: userId,
      emailAdd: googleUser.data.email,
      role: UserRoles.user,
    }

    const jwtToken = createToken(payload);
    res.cookie('jwt', jwtToken, { httpOnly: true });
    res.redirect('/');
  } catch (error: unknown) {
    return res.status(500).json({ message: 'Failed to get user details', error: error });
  }

}

export default googleCallback;