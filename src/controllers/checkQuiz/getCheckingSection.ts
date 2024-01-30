import SectionLeaderboardModel from "@models/leaderboard/sectionLeaderboardModel";
import sendFailureResponse from "@utils/failureResponse";
import { Request, Response } from "express";

interface getCheckingSectionRequest extends Request {
    params: {
        quizId: string,
        sectionIndex: string
    }
}

const getCheckingSection = async (req: getCheckingSectionRequest, res: Response) => {
    const { quizId } = req.params;
    const sectionIndex = parseInt(req.params.sectionIndex, 10);
    try {
        const sectionLeaderboard = await SectionLeaderboardModel.find({ quizId: quizId, sectionIndex: sectionIndex });
        return res.status(200).json({
            sectionLeaderboard: sectionLeaderboard
        })
    } catch (error: unknown) {
        return sendFailureResponse({
            res,
            error,
            messageToSend: "Failed to get section details"
        })
    }
}

export default getCheckingSection