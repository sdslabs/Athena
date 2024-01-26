import LeaderboardModel from '@models/leaderboard/leaderboardModel'
import ResponseModel from '@models/response/responseModel'
import sendFailureResponse from '@utils/failureResponse'
import getQuiz from '@utils/getQuiz'
import { Request, Response } from 'express'
import { Types } from 'mongoose'
import { ResponseStatus } from 'types'

interface generateLeaderBoardRequest extends Request {
  params: {
    quizId: string
  }
}
interface Participant {
  userId: Types.ObjectId
  marks: number
  questionsAttempted: number
  questionsChecked: number
}
const generateLeaderBoard = async (req: generateLeaderBoardRequest, res: Response) => {
  const { quizId } = req.params
  try {
    const quiz = await getQuiz(quizId)
    const participants: Participant[] = []

    await Promise.all(
      quiz?.participants?.map(async (participant) => {
        const responses = await ResponseModel.find({ quizId: quizId, userId: participant.userId })

        let score = 0
        let questionsAttempted = 0
        let questionsChecked = 0

        responses.forEach((response) => {
          score += response.marksAwarded || 0
          questionsAttempted++
          questionsChecked += response.status === ResponseStatus.checked ? 1 : 0
        })

        if (Types.ObjectId.isValid(participant.userId)) {
          const leaderboardEntry: Participant = {
            userId: participant.userId,
            marks: score,
            questionsAttempted: questionsAttempted,
            questionsChecked: questionsChecked,
          }
          participants.push(leaderboardEntry)
        }
      }) as Promise<void>[],
    )

    const sortedParticipants = participants.sort((a, b) => {
      if (a.marks > b.marks) {
        return -1
      } else
        return 1
    })

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
      leaderboard: participants,
    })
  } catch (error: unknown) {
    return sendFailureResponse({
      res,
      error,
      messageToSend: 'Failed to generate leaderboard',
    })
  }
}

export default generateLeaderBoard
