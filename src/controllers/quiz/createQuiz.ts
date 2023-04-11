import { Response, Request } from 'express'
import QuizModel from '@models/quiz/quizModel'
import { Error, Types } from 'mongoose'
import { IQuiz, JwtPayload } from 'types'
import sendFailureResponse from '@utils/failureResponse'
import sendInvalidInputResponse from '@utils/invalidInputResponse'

interface createQuizRequest extends Request {
  body: {
    quizMetadata: IQuiz['quizMetadata']
    managers?: Types.ObjectId[]
    user: JwtPayload
  }
}

const createQuiz = async (req: createQuizRequest, res: Response) => {
  if (!req.body) {
    return sendInvalidInputResponse(res)
  }

  const { quizMetadata, user, managers } = req.body

  if (!quizMetadata) {
    return sendInvalidInputResponse(res)
  }

  try {
    const newQuiz = new QuizModel({
      admin: user.userId,
      managers,
      quizMetadata,
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

export default createQuiz
