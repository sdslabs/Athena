import { Request, Response } from 'express'
import QuizModel from '@models/quiz/quizModel'
import sendFailureResponse from '@utils/failureResponse'

interface publishResultsRequest extends Request {
  params: {
    quizId: string
  }
}

const publishResults = async (req: publishResultsRequest, res: Response) => {
  try {
    await QuizModel.findByIdAndUpdate(req.params.quizId, { resultsPublished: true })
    return res.status(200).json({ message: 'Results published' })
  } catch (error: unknown) {
    return sendFailureResponse({
      res,
      error,
      messageToSend: 'Failed to publish results',
    })
  }
}

export default publishResults
