import sendInvalidInputResponse from '@utils/invalidInputResponse'
import { Request, Response } from 'express'
import QuizModel from '@models/quiz/quizModel'
import { IQuiz, JwtPayload } from 'types'
import sendFailureResponse from '@utils/failureResponse'

interface updateQuizRequest extends Request {
  body: {
    managers?: IQuiz['managers']
    isAcceptingAnswers?: IQuiz['isAcceptingAnswers']
    quizMetadata?: IQuiz['quizMetadata']
    registrationMetadata?: IQuiz['registrationMetadata']
    user: JwtPayload
  }
  params: {
    quizId: string
  }
}

const updateQuiz = async (req: updateQuizRequest, res: Response) => {
  if (!req.body || !req.params.quizId || !req.body.user ) {
    return sendInvalidInputResponse(res)
  }

  // get the data from the request body
  const { managers, isAcceptingAnswers, quizMetadata, registrationMetadata } = req.body
  const quizId = req.params.quizId

  if (!quizId) {
    return sendInvalidInputResponse(res)
  }

  try {
    // update the quiz
    const quiz = await QuizModel.findByIdAndUpdate(
      quizId,
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
      return sendFailureResponse({
        res,
        error: 'Error updating quiz',
        messageToSend: 'Error updating quiz',
        errorCode: 404
      })
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
