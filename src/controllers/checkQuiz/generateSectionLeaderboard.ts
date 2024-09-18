import SectionLeaderboardModel from "@models/leaderboard/sectionLeaderboardModel";
import ResponseModel from "@models/response/responseModel";
import UserModel from '@models/user/userModel';
import sendFailureResponse from "@utils/failureResponse";
import getQuiz from "@utils/getQuiz";
import sendInvalidInputResponse from "@utils/invalidInputResponse";
import { Request, Response } from "express";
import { Types } from "mongoose";
import { ResponseStatus } from "types";

interface generateSectionLeaderboardRequest extends Request {
    params: {
        quizId: string;
        sectionIndex: string;
    };
    query: {
        search: string;
        searchQuery?: string;
    };
}

interface Participant {
    userId: Types.ObjectId;
    marks: number;
    questionsAttempted: number;
    questionsChecked: number;
}

function prefixSearch(searchQuery: string, name: string, phoneNumber: string) {
    if (!searchQuery || searchQuery === '') return true;
    if (/^\d+$/.test(searchQuery)) {
        return phoneNumber.startsWith(searchQuery);
    }
    if (/^[a-zA-Z]+$/.test(searchQuery)) {
        return name.toLowerCase().startsWith(searchQuery.toLowerCase());
    }
    return false;
}

const generateSectionLeaderBoard = async (req: generateSectionLeaderboardRequest, res: Response) => {
    const { quizId } = req.params;
    const sectionIndex = parseInt(req.params.sectionIndex, 10);
    const searchQuery = req.query.search as string;
    console.log('searchQuery', searchQuery);
    console.log('sectionIndex', sectionIndex);

    try {
        // Fetch quiz details
        const quiz = await getQuiz(quizId);
        if (!quiz || !quiz?.sections || sectionIndex >= quiz.sections.length) {
            return sendInvalidInputResponse(res);
        }

        // Get section questions
        const sectionQuestions = quiz.sections[sectionIndex]?.questions || [];
        console.log(sectionQuestions);
        const participants: Participant[] = [];

        // Loop through participants
        for (const participant of quiz.participants || []) {
            const { userId } = participant;

            // Calculate participant's score only for this section
            let marks = 0;
            let questionsAttempted = 0;
            let questionsChecked = 0;

            for (const question of sectionQuestions) {
                const response = await ResponseModel.findOne({
                    quizId,
                    questionId: question._id,
                    userId
                });

                if (response) {
                    marks += response.marksAwarded || 0;
                    questionsAttempted++;
                    questionsChecked += response.status === ResponseStatus.checked ? 1 : 0;
                }
            }

            // Add participant data to leaderboard if valid userId
            if (Types.ObjectId.isValid(userId)) {
                participants.push({
                    userId: userId,
                    marks,
                    questionsAttempted,
                    questionsChecked,
                });
            }
        }
        console.log('participants', participants);

        // Fetch user details and filter participants based on search query
        const filteredParticipantsPromises = participants.map(async (participant) => {
            const user = await UserModel.findById(participant.userId);
            if (user) {
                const name = user.personalDetails?.name?.toLowerCase() || "";
                const phoneNumber = user.personalDetails?.phoneNo || "";
                if (prefixSearch(searchQuery, name, phoneNumber)) {
                    return participant;
                }
            }
            return null;
        });

        const filteredParticipants = (await Promise.all(filteredParticipantsPromises)).filter((p): p is Participant => p !== null);

        console.log('filteredParticipants', filteredParticipants);

        // Sort participants by section marks in descending order
        const sortedParticipants = filteredParticipants.sort((a, b) => b.marks - a.marks);

        // Save/update the leaderboard in SectionLeaderboardModel
        await SectionLeaderboardModel.findOneAndUpdate(
            {
                quizId,
                sectionIndex
            },
            {
                quizId,
                sectionIndex,
                participants: sortedParticipants,
            },
            {
                upsert: true,
            },
        );

        // Send successful response with the generated leaderboard
        return res.status(200).json({
            message: `Leaderboard for section ${sectionIndex} generated successfully`,
            leaderboard: sortedParticipants,
        });
    } catch (error: unknown) {
        // Handle error and send failure response
        return sendFailureResponse({
            res,
            error,
            messageToSend: 'Failed to generate leaderboard',
        });
    }
};

export default generateSectionLeaderBoard;
