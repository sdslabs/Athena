import LeaderboardModel from '@models/leaderboard/sectionLeaderboardModel';
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
    sectionIndex?: string;
  };
  query: {
    search?: string;
  };
}

interface Participant {
  userId: Types.ObjectId;
  marks: number;
  sectionMarks: number[];
  totalMarks: number;
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
  const sectionIndex = req.params.sectionIndex;
  
  let sectionIndexNum: number | null = null;
  if (sectionIndex && sectionIndex !== 'null') {
    sectionIndexNum = parseInt(sectionIndex, 10);
    if (isNaN(sectionIndexNum)) {
      return sendFailureResponse({
        res,
        error: new Error('Invalid section index'),
        messageToSend: 'Invalid section index',
      });
    }
  }
  try {
    const quiz = await getQuiz(quizId);
    const participants: Participant[] = [];

    await Promise.all(
      quiz.participants?.map(async (participant) => {
        let totalMarks = 0;
        const sectionMarks: number[] = new Array(quiz.sections.length).fill(0);
        let questionsAttempted = 0;
        let questionsChecked = 0;

        await Promise.all(
          quiz.sections.map(async (section, sectionIdx) => {
            await Promise.all(
              section.questions.map(async (question) => {
                const response = await ResponseModel.findOne({
                  quizId,
                  questionId: question._id,
                  userId: participant.userId,
                });

                if (response) {
                  sectionMarks[sectionIdx] += response.marksAwarded || 0;
                  totalMarks += response.marksAwarded || 0;
                  questionsAttempted++;
                  questionsChecked += response.status === ResponseStatus.checked ? 1 : 0;
                }
              }),
            );
          }),
        );

        const user = await UserModel.findById(participant.userId);

        if (user) {
          const name = user.personalDetails?.name?.toLowerCase() || '';
          const phoneNumber = user.personalDetails?.phoneNo || '';
          if (
            prefixSearch(searchQuery, name, phoneNumber)
          ) {
            const leaderboardEntry: Participant = {
              userId: participant.userId,
              sectionMarks: sectionMarks,
              totalMarks: totalMarks,
              marks: sectionIndexNum == null ? totalMarks : sectionMarks[sectionIndexNum],
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