import { verifyToken } from '@utils/token';
import { Request, Response, NextFunction } from 'express';
import sendUnauthorizedResponse from '@utils/unauthorisedResponse';
import userModel from '@models/user/userModel';

const isOnboard = async (req: Request, res: Response, next: NextFunction) => {
    // check for token
    const token = req.cookies.jwt;
    if (!token) {
        return sendUnauthorizedResponse(res);
    }

    try {
        const user = verifyToken(token);
        req.body.user = user;
        const userData = await userModel.findById(req.body.user.userId);

        // if not onboarded, redirect to onboard page
        if( !userData?.onboardingComplete ) {
            return res.redirect('/auth/onboard')
        }
        next();

    } catch (error) {
        return sendUnauthorizedResponse(res);
    }
}

export default isOnboard;