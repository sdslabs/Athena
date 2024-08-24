import sendInvalidInputResponse from '@utils/invalidInputResponse'
import { Request, Response } from 'express'
import QuestionModel from '@models/question/questionModel'
import sendFailureResponse from '@utils/failureResponse'
import { JwtPayload } from 'types'

interface getQuestionRequest extends Request {
  body: {
    user: JwtPayload
  }
  params: {
    questionId: string
  }
}

const getQuestion = async (req: getQuestionRequest, res: Response) => {
  if (!req.params.questionId) {
    return sendInvalidInputResponse(res)
  }

  // get data from request body
  const { questionId } = req.params

  try {
    // finding question
    const question = await QuestionModel.findById(questionId)

    // send response
    if (!question) {
      return sendFailureResponse({
        res,
        error: 'Question not found',
        messageToSend: 'Question not found',
        errorCode: 400,
      })
    } else {
      return res.status(200).json({
        message: 'Question found',
        question,
      })
    }
  } catch (error: unknown) {
    sendFailureResponse({
      res,
      error,
      messageToSend: 'Failed to get question',
    })
  }
}

export default getQuestion
