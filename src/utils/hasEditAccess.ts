import { Request, Response, NextFunction } from 'express';
import { JwtPayload, UserRoles } from 'types';
import getQuiz from './getQuiz';
import sendInvalidInputResponse from './invalidInputResponse';
import sendUnauthorizedResponse from './unauthorisedResponse';

interface hasEditAccessRequest extends Request {
    body: {
        user: JwtPayload,
    },
    params: {
        quizId: string,
    }
}

const hasEditAccess = async (req: hasEditAccessRequest, res: Response, next: NextFunction) => {
    const user = req.body.user;
    const { quizId } = req.params;

    if(!quizId){
        return sendInvalidInputResponse(res);
    }

    try {
        // extract adminId from Quiz
        const quiz = await getQuiz(quizId);
        if (!quiz) {
            return sendInvalidInputResponse(res);
        }
        //check if user is superAdmin
        if (user.role === UserRoles.superAdmin) {
            return next();
        }

        // check if user is admin
        if (user.userId === quiz.admin) {
            return next();
        }

        // check if user is manager
        if (quiz.managers?.indexOf(user.userId) !== -1) {
            return next();
        }

        return sendUnauthorizedResponse(res);
    } catch (error: unknown) {
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
}

export default hasEditAccess;