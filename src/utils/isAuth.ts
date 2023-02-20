import { verifyToken } from '@utils/token';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'types';
import sendUnauthorizedResponse from '@utils/unauthorisedResponse';

interface authRequest extends Request {
    user: JwtPayload
}

export const isAuth = (req: authRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;
    if (!token) {
        return sendUnauthorizedResponse(res);
    }
    try {
        const user = verifyToken(token);
        req.user = user;
        next();
    } catch (error) {
        return sendUnauthorizedResponse(res);
    }

    next();
}