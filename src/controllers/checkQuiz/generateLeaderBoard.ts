import LeaderboardModel from '@models/leaderboard/leaderboardModel';
import ResponseModel from '@models/response/responseModel';
import sendFailureResponse from '@utils/failureResponse';
import getQuiz from '@utils/getQuiz';
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { ResponseStatus } from 'types';
import sendInvalidInputResponse from '@utils/invalidInputResponse';
//DONE
interface generateLeaderBoardRequest extends Request {
  params: {
    quizId: string;
    sectionIndex?: string;
  };
}

interface Participant {
  userId: Types.ObjectId;
  marks: number;
  questionsAttempted: number;
  questionsChecked: number;
}

const generateLeaderBoard = async (req: generateLeaderBoardRequest, res: Response) => {
  const { quizId } = req.params;
  let sectionIndex = req.params.sectionIndex ? parseInt(req.params.sectionIndex, 10) : null;
  if (sectionIndex != null && isNaN(sectionIndex)) {
    sectionIndex = null;
  }
  console.log('Generating leaderboard for quiz:', quizId);
  console.log('Section index:', sectionIndex);

  try {
    const quiz = await getQuiz(quizId);
    console.log('Quiz found:', quiz);
    if (!quiz || !quiz?.sections) {
        return sendInvalidInputResponse(res);
    }
    
    const participants: Participant[] = [];

    let Questions = [];

    if (sectionIndex != null) {
      console.log('Section index: not null');
      Questions = quiz.sections[sectionIndex]?.questions || [];
    } else {
      console.log('Section index: null');
      Questions = quiz.sections.flatMap((section) => section.questions);
    }

    await Promise.all(
      quiz?.participants?.map(async (participant) => {
        const responses = await ResponseModel.find({
          userId: participant.userId,
          quizId: quizId,
          questionId: { $in: Questions.filter((q) => q !== undefined).map((q) => q._id) },
        });
        let score = 0;
        let questionsAttempted = 0;
        let questionsChecked = 0;

        responses.forEach((response) => {
          score += response.marksAwarded || 0;
          questionsAttempted++;
          questionsChecked += response.status === ResponseStatus.checked ? 1 : 0;
        });

        if (
          Types.ObjectId.isValid(participant.userId)
        ) {
          const leaderboardEntry: Participant = {
            userId: participant.userId,
            marks: score,
            questionsAttempted: questionsAttempted,
            questionsChecked: questionsChecked,
          };

          participants.push(leaderboardEntry);
        }
      }) as Promise<void>[],
    );

    const sortedParticipants = participants.sort((a, b) => b.marks - a.marks);

    console.log('Sorted participants:', sortedParticipants);

    await LeaderboardModel.findOneAndUpdate(
      { quizId: quizId, sectionIndex: sectionIndex },
      {
        quizId: quizId,
        sectionIndex: sectionIndex,
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