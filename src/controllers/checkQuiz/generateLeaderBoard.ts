import LeaderboardModel from '@models/leaderboard/leaderboardModel';
import ResponseModel from '@models/response/responseModel';
import UserModel from '@models/user/userModel';
import sendFailureResponse from '@utils/failureResponse';
import getQuiz from '@utils/getQuiz';
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { ResponseStatus } from 'types';

interface generateLeaderBoardRequest extends Request {
  params: {
    quizId: string;
  };
  query: {
    search?: string;
  };
}

interface Participant {
  userId: Types.ObjectId;
  marks: number;
  questionsAttempted: number;
  questionsChecked: number;
}

function prefixSearch(searchQuery: string, name: string, phoneNumber: string) { //checks if the search query is a prefix of the name or phone number
  if (!searchQuery || searchQuery === '') return true;
  if (/^\d+$/.test(searchQuery)) {
      return phoneNumber.startsWith(searchQuery); //only prefix of the phone number
  }
  if (/^[a-zA-Z]+$/.test(searchQuery)) {
      return name.toLowerCase().startsWith(searchQuery.toLowerCase()); //only prefix of the name
  }
  return false;
}


const generateLeaderBoard = async (req: generateLeaderBoardRequest, res: Response) => {
  const { quizId } = req.params;
  const searchQuery = req.query.search as string;

  try {
    const quiz = await getQuiz(quizId);
    const participants: Participant[] = [];

    await Promise.all(
      quiz?.participants?.map(async (participant) => {
        const responses = await ResponseModel.find({ quizId: quizId, userId: participant.userId });

        let score = 0;
        let questionsAttempted = 0;
        let questionsChecked = 0;

        responses.forEach((response) => {
          score += response.marksAwarded || 0;
          questionsAttempted++;
          questionsChecked += response.status === ResponseStatus.checked ? 1 : 0;
        });

        const user = await UserModel.findById(participant.userId);

        if (user) {
          const name = user.personalDetails?.name?.toLowerCase() || '';
          const phoneNumber = user.personalDetails?.phoneNo || '';
          if (
            prefixSearch(searchQuery, name, phoneNumber)
          ) {
            const leaderboardEntry: Participant = {
              userId: participant.userId,
              marks: score,
              questionsAttempted: questionsAttempted,
              questionsChecked: questionsChecked,
            };

            participants.push(leaderboardEntry);
          }
        }
      }) as Promise<void>[],
    );

    const sortedParticipants = participants.sort((a, b) => b.marks - a.marks);
    await LeaderboardModel.findOneAndUpdate(
      { quizId: quizId },
      {
        quizId: quizId,
        participants: sortedParticipants,
      },
      { upsert: true },
    );

    return res.status(200).json({
      message: 'Leaderboard generated successfully',
      leaderboard: sortedParticipants,
    });
  } catch (error: unknown) {
    return sendFailureResponse({
      res,
      error,
      messageToSend: 'Failed to generate leaderboard',
    });
  }
};

export default generateLeaderBoard;
