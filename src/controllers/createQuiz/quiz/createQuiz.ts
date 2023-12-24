import { Response, Request } from 'express'
import QuizModel from '@models/quiz/quizModel'
import { Error } from 'mongoose'
import { JwtPayload } from 'types'
import sendFailureResponse from '@utils/failureResponse'

interface hostQuizRequest extends Request {
  body: {
    user: JwtPayload
  }
}

const hostQuiz = async (req: hostQuizRequest, res: Response) => {
  const { user } = req.body

  try {
    const newQuiz = new QuizModel({
      admin: user.userId,
    })
    const quiz = await newQuiz.save()
    res.status(201).json({
      message: 'Quiz created',
      quizId: quiz._id,
    })
  } catch (error: unknown) {
    if (error instanceof Error.ValidationError) {
      return sendFailureResponse({
        res,
        error,
        messageToSend: 'Missing required fields',
        errorCode: 400,
      })
    }

    sendFailureResponse({
      res,
      error,
      messageToSend: 'Failed to create quiz',
    })
  }
}

export default hostQuiz
