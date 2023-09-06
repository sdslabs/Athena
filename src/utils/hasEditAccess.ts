import { Request, Response, NextFunction } from 'express';
import { UserRoles } from 'types';
import sendUnauthorizedResponse from './unauthorisedResponse';
import sendInvalidInputResponse from './invalidInputResponse';
import getQuiz from './getQuiz';
import sendFailureResponse from './failureResponse';

const hasEditAccess = async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.body;
    const { quizId } = req.params;

    if (!quizId) {
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
        if (user.userId === quiz.admin.toString()) {
            return next();
        }

        // check if user is manager
        if (quiz.managers?.indexOf(user.userId) !== -1) {
            return next();
        }

        return sendUnauthorizedResponse(res);
    } catch (error: unknown) {
        return sendFailureResponse({
            res,
            error,
            messageToSend: 'Internal Server Error',
        });
    }
}

export default hasEditAccess;