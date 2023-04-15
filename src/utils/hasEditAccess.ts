import QuizModel from '@models/quiz/quizModel';
import { Request, Response, NextFunction } from 'express';

export const hasEditAccess = async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.body;
    const { quizId } = req.params;

    if(!user || !quizId) {
        return res.status(400).json({
            message: 'Invalid input',
        });
    }

    try {
        // extract adminId from Quiz
        const quiz = await QuizModel.findById(quizId);
        if (!quiz) {
            return res.status(404).json({
                message: 'Quiz not found',
            });
        }
        // check if user is admin
        if (user.userId === quiz.admin.toString()) {
            return next();
        }
        // check if user is manager
        if (quiz.managers?.indexOf(user.userId) !== -1) {
            return next();
        }
        return res.status(401).json({
            message: 'Unauthorized',
        });
    } catch (error: unknown) {
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
}