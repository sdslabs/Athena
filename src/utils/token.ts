import { sign, verify } from 'jsonwebtoken';
import { jwtPayload } from 'types';

export const createToken = (payload: jwtPayload) => {
    return sign(payload, process.env.JWT_KEY || '', { expiresIn: process.env.JWT_EXPIRY || '1d' });
}

export const verifyToken = (token: string) => {
    const user = verify(token, process.env.JWT_SECRET || '');
    return user as jwtPayload;
}