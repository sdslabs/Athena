import sendInvalidInputResponse from '@utils/invalidInputResponse'
import { Request, Response } from 'express'
import QuizModel from '@models/quiz/quizModel'
import { Types } from 'mongoose'
import { IQuiz, JwtPayload } from 'types'
import sendFailureResponse from '@utils/failureResponse'

interface updateQuizRequest extends Request {
  body: {
    managers?: IQuiz['managers']
    isAcceptingAnswers?: IQuiz['isAcceptingAnswers']
    quizMetadata?: IQuiz['quizMetadata']
    registrationMetadata?: IQuiz['registrationMetadata']
    userId: Types.ObjectId
    user: JwtPayload
  }
  params: {
    quizId: string
  }
}

const updateQuiz = async (req: updateQuizRequest, res: Response) => {
  if (!req.body || !req.params.quizId || !req.body.userId ) {
    return sendInvalidInputResponse(res)
  }

  // get the data from the request body
  const { managers, isAcceptingAnswers, quizMetadata, registrationMetadata, userId } = req.body
  const quizId = req.params.quizId

  if (!quizId) {
    return sendInvalidInputResponse(res)
  }

  try {
    // update the quiz
    const quiz = await QuizModel.findOneAndUpdate(
      { _id: quizId, admin: userId },
      {
        managers: managers,
        isAcceptingAnswers: isAcceptingAnswers,
        quizMetadata: quizMetadata,
        registrationMetadata: registrationMetadata,
      },
      { new: true }
    )
    
    // send the response back
    if(!quiz) {
      return res.status(404).send({ message: 'Error updating quiz' })
    } else {
      return res.status(200).send({ message: 'Quiz updated', updatedParameters: { quizId: quiz._id, managers, isAcceptingAnswers, quizMetadata, registrationMetadata }})
    }
  } catch (error: unknown) {
    sendFailureResponse({
      res,
      error,
      messageToSend: 'Failed to update quiz',
    })
  }
}

export default updateQuiz
