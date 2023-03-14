import { sign, verify } from 'jsonwebtoken';
import { JwtPayload } from 'types';

export const createToken = (payload: JwtPayload) => {
    return sign(payload, process.env.JWT_KEY || 'Athena2023', { expiresIn: process.env.JWT_EXPIRY || '1d' });
}

export const verifyToken = (token: string) => {
    const user = verify(token, process.env.JWT_SECRET || '');
    return user as JwtPayload;
}