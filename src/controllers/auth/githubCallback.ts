import axios from 'axios';
import { Request, Response } from 'express';
import UserModel from '@models/user/userModel';
import { OAuthProviders, UserRoles, IUser, JwtPayload } from 'types';
import { createToken } from '@utils/token';
import { Types } from 'mongoose';

const githubCallback = async (req: Request, res: Response) => {
    const code: string = req.query.code as string;

    const response = await axios
        .post(`${process.env.GITHUB_TOKEN_URL}${code}`,
            {
                headers: {
                    accept: 'application/json'
                }
            });
    
    const accessToken = response.data.split('&')[0].split('=')[1];

    const githubUser = await axios.get(process.env.GITHUB_USER_URL!, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })

    if (!githubUser.data.email) {
        const emails = await axios.get(process.env.GITHUB_EMAIL_URL!, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        githubUser.data.email = emails.data[0].email;
    }
    const user: IUser = await UserModel.findOne({ "personalDetails.emailAdd": githubUser.data.email, oauthProvider: OAuthProviders.github }) as IUser;
    let userId: Types.ObjectId;
    if (user) {
        userId = user._id as Types.ObjectId;
        console.log("user exists");
    }
    else {
        console.log("user does not exist");
        const newUser = new UserModel({
            oauthProvider: OAuthProviders.github,
            emailAdd: githubUser.data.email,
            personalDetails: {
                name: githubUser.data.name || githubUser.data.login,
                emailAdd: githubUser.data.email,
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

    const payload: JwtPayload = {
        userId: userId,
        emailAdd: githubUser.data.email,
        role: UserRoles.user,
    }

    const jwtToken = createToken(payload);
    res.cookie('jwt', jwtToken, { httpOnly: true });

    return res.redirect('/');
}

export default githubCallback