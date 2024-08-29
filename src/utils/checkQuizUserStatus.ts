import { Response } from 'express';
import { IQuiz, IParticipant, QuizUserStatus } from '../types/quiz';
import sendFailureResponse from './failureResponse';

const checkQuizUserStatus = (quiz: IQuiz, user: IParticipant): QuizUserStatus => {
    if (!quiz.isPublished) {
        return QuizUserStatus.QUIZ_NOT_STARTED;
    }
    if (!quiz.isAcceptingAnswers) {
        return QuizUserStatus.QUIZ_NOT_ACCEPTING_ANSWERS;
    }
    if (user.submitted) {
        return QuizUserStatus.SUBMITTED;
    }
    if (user.startTime === 0) {
        return QuizUserStatus.USER_NOT_STARTED;
    }

    const currentTime = new Date().getTime()
    const quizDurationInMins = (quiz?.quizMetadata?.duration as any).getTime()
    const quizDurationInMs = quizDurationInMins * 60 * 1000;
    const timeInQuiz = currentTime - user.startTime;

    if (timeInQuiz >= quizDurationInMs) {
        return QuizUserStatus.AUTO_SUBMIT_QUIZ;
    }
    return QuizUserStatus.USER_IS_GIVING_QUIZ;
}

const isQuizUserStatusValid = (currentStatus: QuizUserStatus, res: Response) : boolean => {
    switch (currentStatus) {
        case QuizUserStatus.QUIZ_NOT_ACCEPTING_ANSWERS:
            sendFailureResponse({
                res,
                errorCode: 400,
                error: new Error('Quiz not accepting answers'),
                messageToSend: 'Quiz not accepting answers',
            })
            return false;
        case QuizUserStatus.QUIZ_NOT_STARTED:
            sendFailureResponse({
                res,
                errorCode: 400,
                error: new Error('Quiz not started'),
                messageToSend: 'Quiz not started',
            })
            return false;
        case QuizUserStatus.USER_NOT_STARTED:
            sendFailureResponse({
                res,
                errorCode: 400,
                error: new Error('User has not started the quiz'),
                messageToSend: 'User has not started the quiz',
            })
            return false;
        case QuizUserStatus.SUBMITTED:
            sendFailureResponse({
                res,
                errorCode: 400,
                error: new Error('User has already submitted the quiz'),
                messageToSend: 'User has already submitted the quiz',
            })
            return false;
        case QuizUserStatus.AUTO_SUBMIT_QUIZ:
            return true;
        case QuizUserStatus.USER_IS_GIVING_QUIZ:
            return true;
        default:
            sendFailureResponse({
                res,
                errorCode: 400,
                error: new Error('Invalid status'),
                messageToSend: 'Invalid status',
            })
            return false;
    }
}

export default { checkQuizUserStatus, isQuizUserStatusValid };