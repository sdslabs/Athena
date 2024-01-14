import { Response, Request } from 'express'
import sendFailureResponse from '@utils/failureResponse'
import sendInvalidInputResponse from '@utils/invalidInputResponse'
import getQuiz from '@utils/getQuiz'

interface getQuizRequest extends Request {
  params: {
    quizId: string
  }
}
const padTo2Digits = (num: number) => {
  return num.toString().padStart(2, '0');
}

const formatDate = (timestamp: Date) => {
  return [
    timestamp.getFullYear(),
    padTo2Digits(timestamp.getMonth() + 1),
    padTo2Digits(timestamp.getDate()),
  ].join('-');
}

const formatTime = (timestamp: Date) => {
  return [
    padTo2Digits(timestamp.getHours()),
    padTo2Digits(timestamp.getMinutes()),
  ].join(':');
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
        startDate: quizMetadata?.startDateTimestamp ? formatDate(quizMetadata?.startDateTimestamp) : '',
        startTime: quizMetadata?.startDateTimestamp ? formatTime(quizMetadata?.startDateTimestamp) : '',
        endDate: quizMetadata?.endDateTimestamp ? formatDate(quizMetadata?.endDateTimestamp) : '',
        endTime: quizMetadata?.endDateTimestamp ? formatTime(quizMetadata?.endDateTimestamp) : '',
        duration: quizMetadata?.duration? `${Math.floor(quizMetadata?.duration / 60).toString().padStart(2, '0')}:${(quizMetadata?.duration % 60).toString().padStart(2, '0')}` : '',
        accessCode: quizMetadata?.accessCode || '',
        bannerImage: quizMetadata?.bannerImage || '',
      }
      const registrationForm = {
        customFields: registrationMetadata?.customFields || [],
      }
      const sectionsDetails = sections?.map((section) => {
        return {
          name: section.name || '',
          instructions: section.instructions || '',
          questions: section.questions || [],
        }
      });
      return res.status(200).send({ message: 'Quiz found', quizDetails, registrationForm, sectionsDetails })
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