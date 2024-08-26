import SectionLeaderboardModel from "@models/leaderboard/sectionLeaderboardModel";
import ResponseModel from "@models/response/responseModel";
import sendFailureResponse from "@utils/failureResponse";
import getQuiz from "@utils/getQuiz";
import sendInvalidInputResponse from "@utils/invalidInputResponse";
import { Request, Response } from "express";
import { Types } from "mongoose";
import { ResponseStatus } from "types";

interface generateSectionLeaderboardRequest extends Request {
    params: {
        quizId: string,
        sectionIndex: string
    }
    query: {
        searchQuery?: string
    }
}

interface Participant {
    userId: Types.ObjectId
    marks: number
    questionsAttempted: number
    questionsChecked: number
}

const generateSectionLeaderBoard = async (req: generateSectionLeaderboardRequest, res: Response) => {
    const { quizId } = req.params
    const sectionIndex = parseInt(req.params.sectionIndex, 10);
    const searchQuery = req.query.searchQuery as string;

    try {
        const quiz = await getQuiz(quizId)
        if (!quiz || !quiz?.sections || sectionIndex >= quiz.sections.length) {
            return sendInvalidInputResponse(res);
        }
        const questions = quiz?.sections[sectionIndex].questions
        const participants: Participant[] = []

        for (const participant of quiz?.participants || []) {
            let score = 0;
            let questionsAttempted = 0;
            let questionsChecked = 0;

            for (const question of questions || []) {
                const response = await ResponseModel.findOne({ quizId: quizId, questionId: question._id, userId: participant.userId });
                score += response?.marksAwarded || 0;
                questionsAttempted++;
                questionsChecked += response?.status === ResponseStatus.checked ? 1 : 0;
            }

            if (Types.ObjectId.isValid(participant.userId)) {
                const leaderboardEntry: Participant = {
                    userId: participant.userId,
                    marks: score,
                    questionsAttempted: questionsAttempted,
                    questionsChecked: questionsChecked,
                };
                participants.push(leaderboardEntry);
            }
        }

        const filteredParticipants = participants.filter(participant => {
            const userIdStr = participant.userId.toString();
            return !searchQuery || userIdStr.includes(searchQuery);
        });

        console.log("filteredParticipants", filteredParticipants);

        const sortedParticipants = filteredParticipants.sort((a, b) => {
            return b.marks - a.marks; 
        });

        await SectionLeaderboardModel.findOneAndUpdate(
            {
                quizId: quizId,
                sectionIndex: sectionIndex
            },
            {
                quizId: quizId,
                sectionIndex: sectionIndex,
                participants: sortedParticipants,
            },
            {
                upsert: true,
            },
        );

        return res.status(200).json({
            message: `Leaderboard for section ${sectionIndex} generated successfully`,
            leaderboard: sortedParticipants,
        });
    } catch (error: unknown) {
        return sendFailureResponse({
            res,
            error,
            messageToSend: 'Failed to generate leaderboard',
        });
    }
}

export default generateSectionLeaderBoard;
