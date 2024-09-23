import SectionLeaderboardModel from "@models/leaderboard/sectionLeaderboardModel";
import sendFailureResponse from "@utils/failureResponse";
import { Request, Response } from "express";

interface getCheckingSectionRequest extends Request {
    params: {
        quizId: string,
        sectionIndex: string
    },
    query: {
        searchQuery?: string
    }
}

const getCheckingSection = async (req: getCheckingSectionRequest, res: Response) => {
    const { quizId } = req.params;
    const searchQuery = req.query.searchQuery as string;
    const sectionIndex = parseInt(req.params.sectionIndex, 10);
    
    try {
        const sectionLeaderboard = await SectionLeaderboardModel.find({ quizId, sectionIndex });
        const filteredSectionLeaderboard = sectionLeaderboard.map(leaderboard => {
            const filteredParticipants = leaderboard.participants.filter(participant => {
                const name = participant.name || '';
                const phoneNumber = participant.phoneNumber || '';
                return !searchQuery || name.includes(searchQuery) || phoneNumber.includes(searchQuery);
            });
            return {
                ...leaderboard.toObject(),
                participants: filteredParticipants
            };
        });

        return res.status(200).json({
            sectionLeaderboard: filteredSectionLeaderboard
        });
    } catch (error: unknown) {
        return sendFailureResponse({
            res,
            error,
            messageToSend: "Failed to get section details"
        });
    }
}

export default getCheckingSection;