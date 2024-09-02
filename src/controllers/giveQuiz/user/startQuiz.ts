import { Response, Request } from 'express'
import QuizModel from '@models/quiz/quizModel'
import { IParticipant, IQuiz, JwtPayload, QuizUserStatus } from 'types'
import sendInvalidInputResponse from '@utils/invalidInputResponse'
import isParticipant from '@utils/isParticipant'
// import timerService from 'services/timer'
import { checkQuizUserStatus } from '@utils/checkQuizUserStatus'

interface startQuizRequest extends Request {
  body: {
    user: JwtPayload
    accessCode?: string
  }
  params: {
    quizId: string
  }
}
const startQuiz = async (req: startQuizRequest, res: Response) => {
  const { user, accessCode } = req.body
  const { quizId } = req.params

  if (!user) {
    return sendInvalidInputResponse(res)
  }

  try {
    const quiz = await QuizModel.findById(quizId)
    const dbUser = isParticipant(user.userId, quiz?.participants)
    const currentStatus = checkQuizUserStatus(quiz as IQuiz, dbUser as IParticipant)

    if (!quiz || !quiz.isPublished || !dbUser) {
      return res.status(400).json({
        success: false,
        message: 'User not registered for this quiz',
      })
    }

    if (quiz.quizMetadata?.accessCode !== accessCode) {
      return res.status(401).json({
        success: false,
        message: 'Invalid access code',
      })
    }

    switch (currentStatus) {
      case QuizUserStatus.USER_IS_GIVING_QUIZ:
        // timerService(dbUser, currentStatus) ??
        return res.status(200).json({
          success: true,
          message: 'Quiz resumed successfully',
        })

      case QuizUserStatus.USER_NOT_STARTED:
        await quiz.save()
        // timerService(dbUser, currentStatus) ??
        return res.status(200).json({
          success: true,
          message: 'Quiz started successfully',
        })

      case QuizUserStatus.AUTO_SUBMIT_QUIZ:
        // auto submit quiz
        dbUser.submitted = true
        await quiz.save()
        console.log('Auto submit quiz')
        return res.status(200).json({ message: 'Quiz auto submitted' })

      case QuizUserStatus.SUBMITTED:
        return res.status(200).json({ message: 'Quiz already submitted' })

      case QuizUserStatus.QUIZ_NOT_ACCEPTING_ANSWERS:
        return res.status(200).json({ message: 'Quiz not accepting answers' })

      case QuizUserStatus.QUIZ_NOT_STARTED:
        return res.status(200).json({ message: 'Quiz not started' })
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid quiz status',
        })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}
export default startQuiz
