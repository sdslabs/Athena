import  { Request, Response, NextFunction } from 'express';
import { UserRoles } from 'types'
import sendUnauthorizedResponse from './unauthorisedResponse';

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.body;
    if (user.role === UserRoles.superAdmin || user.role === UserRoles.admin) {
        return next();
    }
    return sendUnauthorizedResponse(res);
}

export default isAdmin;