import ResponseModel from '@models/response/responseModel'
import sendFailureResponse from '@utils/failureResponse'
import sendInvalidInputResponse from '@utils/invalidInputResponse'
import { Request, Response } from 'express'

interface getResponseRequest extends Request {
  params: {
    responseId: string
  }
}

const getResponse = async (req: getResponseRequest, res: Response) => {
  const { responseId } = req.params
  if (!responseId) {
    return sendInvalidInputResponse(res)
  }
  try {
    const response = await ResponseModel.findById(responseId).populate({
      path: 'checkedBy',
      select: 'personalDetails.name personalDetails.emailAdd',
    })
    if (!response) {
      return sendInvalidInputResponse(res)
    }
    return res.status(200).json({
      response: {
        user: response?.userId,
        selectedOptionId: response?.selectedOptionId,
        subjectiveAnswer: response?.subjectiveAnswer,
        marksAwarded: response?.marksAwarded,
        status: response?.status,
        checkedBy: response?.checkedBy?.personalDetails?.name,
      },
    })
  } catch (error: unknown) {
    return sendFailureResponse({
      res,
      error,
      messageToSend: 'Failed to get response',
    })
  }
}

export default getResponse
