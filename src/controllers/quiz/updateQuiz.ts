import sendInvalidInputResponse from '@utils/invalidInputResponse'
import { Request, Response } from 'express'
import QuizModel from '@models/quiz/quizModel'
import { Types } from 'mongoose'
import { IQuiz } from 'types'
import sendFailureResponse from '@utils/failureResponse'

interface updateQuizRequest extends Request {
  body: {
    managers?: IQuiz['managers']
    isAcceptingAnswers?: IQuiz['isAcceptingAnswers']
    quizMetadata?: IQuiz['quizMetadata']
    registrationMetadata?: IQuiz['registrationMetadata']
    userId: Types.ObjectId
  }
  params: {
    quizId: string
  }
}

const updateQuiz = async (req: updateQuizRequest, res: Response) => {
  if (!req.body) {
    return sendInvalidInputResponse(res)
  }

  // get the data from the request body
  const { managers, isAcceptingAnswers, quizMetadata, registrationMetadata, userId } = req.body
  const { quizId } = req.params

  if (!quizId) {
    return sendInvalidInputResponse(res)
  }

  try {
    // check if the quiz exists
    const check:any = await QuizModel.findOne({ _id: quizId, admin: userId });
    if (!check) {
      return res.status(404).send({ message: 'Quiz not found' })
    }

    // update the quiz
    const quiz = await QuizModel.findOneAndUpdate(
      { _id: quizId, admin: userId },
      {
        $set: {
          managers,
          isAcceptingAnswers,
          quizMetadata,
          registrationMetadata,
        },
      },
      { new: true }
    )
    
    // send the response back
    if(!quiz) {
      return res.status(404).send({ message: 'Quiz not found' })
    } else {
      return res.status(200).send({ message: 'Quiz updated', quiz })
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
