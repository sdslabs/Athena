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
  try {
    const quiz = await getQuiz(req.params.quizId)
    if (!quiz) {
      return sendInvalidInputResponse(res)
    }
    if (quiz?.isPublished && quiz?.isAcceptingAnswers) {
      const quizDetails = {
        _id: quiz._id,
        name: quiz?.quizMetadata?.name,
        description: quiz?.quizMetadata?.description,
        instructions: quiz?.quizMetadata?.instructions,
        startDateTimestamp: quiz?.quizMetadata?.startDateTimestamp,
        endDateTimestamp: quiz?.quizMetadata?.endDateTimestamp,
        sections: quiz?.sections
      }
      return res.status(200).send({ message: 'Quiz fetched', quiz: quizDetails })
    }
    else {
      return sendFailureResponse({
        res,
        error: 'Error fetching quiz, this quiz is not alive',
        messageToSend: 'Error fetching quiz, this quiz is not live',
        errorCode: 400
      });
    }
  }
  catch (error: unknown) {
    sendFailureResponse({
      res,
      error,
      messageToSend: 'Failed to fetch quiz',
    })
  }
}

export default quizGet