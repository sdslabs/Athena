import { Request, Response } from "express";
import QuizModel from "@models/quiz/quizModel";
import sendInvalidInputResponse from "@utils/invalidInputResponse";
import sendFailureResponse from "@utils/failureResponse";
import LeaderboardModel from "@models/leaderboard/leaderboardModel";

interface getDashboardRequest extends Request {
    params: {
        quizId: string
    }
}

const getDashboard = async (req: getDashboardRequest, res: Response) => {
    const quizId = req.params.quizId;
    try {
        const quiz = await QuizModel.findById(quizId).populate({
            path: 'sections',
            select: 'name questions',
            populate: {
                path: 'questions',
                select: 'type description totalAttempts checkedAttempts assignedTo',
                populate: {
                    path: 'assignedTo',
                    select: 'personalDetails.name personalDetails.emailAdd'
                }
            }
        });
        if (!quiz) {
            return sendInvalidInputResponse(res);
        }
        let checksCompleted = 0;
        quiz?.sections?.forEach(section => {
            section?.questions?.forEach(question => {
                checksCompleted += question?.checkedAttempts || 0;
            })
        })
        const leaderboard = LeaderboardModel.find({ quizId: quizId });
        return res.status(200).json({
            admin: quiz.admin,
            scheduled: quiz.quizMetadata?.startDateTimestamp,
            sections: quiz.sections,
            participants: quiz?.participants?.length,
            checksCompleted: checksCompleted,
            leaderboard: leaderboard
        })
    }
    catch (error: unknown) {
        return sendFailureResponse({
            res,
            error,
            messageToSend: "Failed to get checking dashboard"
        })
    }
}

export default getDashboard