import { Response, Request } from 'express'
import QuizModel from '@models/quiz/quizModel'
import { IParticipant, IQuiz, JwtPayload, QuizUserStatus } from 'types'
import sendInvalidInputResponse from '@utils/invalidInputResponse'
import isParticipant from '@utils/isParticipant'
import { checkQuizUserStatus } from '@utils/checkQuizUserStatus'

interface getStartTimeRequest extends Request {
  body: {
    user: JwtPayload
  }
  params: {
    quizId: string
  }
}

const startQuiz = async (req: getStartTimeRequest, res: Response) => {
  const { user } = req.body
  const { quizId } = req.params

  if (!user) {
    return sendInvalidInputResponse(res)
  }

  try {
    const quiz = await QuizModel.findById(quizId)
    const dbUser = isParticipant(user.userId, quiz?.participants)
    if (!quiz || !quiz.isPublished || !dbUser) {
      return res.status(400).json({
        success: false,
        message: 'User not registered for this quiz',
      })
    }
    const currentStatus = checkQuizUserStatus(quiz as IQuiz, dbUser as IParticipant)
    if (currentStatus === QuizUserStatus.USER_IS_GIVING_QUIZ) {
      return res.status(400).json({
        success: false,
        message: 'User is already giving the quiz',
      })
    } else if (currentStatus === QuizUserStatus.USER_NOT_STARTED) {
      const startTime = new Date().getTime()
      dbUser.startTime = startTime
      await quiz.save()

      return res.status(200).json({
        success: true,
        message: 'Quiz timer set successfully',
        startTime,
      })
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid request on the getStartTime endpoint',
      })
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      startTime: null,
    })
  }
}

export default startQuiz
