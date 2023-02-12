import sendInvalidInputResponse from '@utils/invalidInputResponse'
import { Request, Response } from 'express'
import { Types } from 'mongoose'
import { IQuiz } from 'types'

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

  // TODO: Implement update quiz
  res.send('Update quiz')
}

export default updateQuiz
