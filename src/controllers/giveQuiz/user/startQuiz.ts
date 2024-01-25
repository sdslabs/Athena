import { Response, Request } from 'express'
import QuizModel from '@models/quiz/quizModel'
import { JwtPayload } from 'types'
import sendInvalidInputResponse from '@utils/invalidInputResponse'
import isParticipant from '@utils/isParticipant'

interface startQuizRequest extends Request {
  body: {
    user: JwtPayload
    accessCode: string
  }
  params: {
    quizId: string
  }
}

const startQuiz = async (req: startQuizRequest, res: Response) => {
  const { user, accessCode } = req.body
  const { quizId } = req.params

  if (!user || !accessCode) {
    return sendInvalidInputResponse(res)
  }

  try {
    const quiz = await QuizModel.findById(quizId)
    const isUserRegistered = isParticipant(user.userId, quiz?.participants)

    if (!quiz || !quiz.isPublished || !isUserRegistered) {
      return sendInvalidInputResponse(res)
    }

    if (quiz.quizMetadata?.accessCode !== accessCode) {
      return res.status(401).json({
        success: false,
        message: 'Invalid access code',
      })
    }
    await quiz.save()
    return res.status(200).json({
      success: true,
      message: 'Quiz started successfully',
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}

export default startQuiz
