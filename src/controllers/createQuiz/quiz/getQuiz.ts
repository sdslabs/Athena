import { Response, Request } from 'express'
import sendFailureResponse from '@utils/failureResponse'
import sendInvalidInputResponse from '@utils/invalidInputResponse'
import getQuiz from '@utils/getQuiz'

interface getQuizRequest extends Request {
  params: {
    quizId: string
  }
}

const quizGet = async (req: getQuizRequest, res: Response) => {
  if (!req.params.quizId) {
    return sendInvalidInputResponse(res)
  }
  try{
    const quiz = await getQuiz(req.params.quizId)
    if (!quiz) {
      return sendInvalidInputResponse(res)
    } else {
      const { quizMetadata, registrationMetadata, sections, managers} = quiz

      const quizDetails = {
        name: quizMetadata?.name || '',
        managers: managers || [],
        description: quizMetadata?.description || '',
        instructions: quizMetadata?.instructions || '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        duration: '',
        accessCode: '',
        bannerImage: quizMetadata?.bannerImage || '',
      }
      const registrationForm = {
        customFields: registrationMetadata?.customFields || [],
      }
      return res.status(200).send({ message: 'Quiz found', quizDetails, registrationForm })
    }
  } catch (error: unknown) {
    sendFailureResponse({
      res,
      error,
      messageToSend: 'Error getting quiz',
      errorCode: 500
    })
  }
}

export default quizGet