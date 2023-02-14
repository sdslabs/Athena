import { verifyToken } from '@utils/token';
import { Request, Response, NextFunction } from 'express';
import { jwtPayload } from 'types';

interface authRequest extends Request {
    user: jwtPayload
}

export const isAuth = (req: authRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const user = verifyToken(token);
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    next();
}