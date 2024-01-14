import { Request, Response } from 'express'
import sendFailureResponse from '@utils/failureResponse'
import sendInvalidInputResponse from '@utils/invalidInputResponse'
import QuizModel from '@models/quiz/quizModel'
import ResponseModel from '@models/response/responseModel'

interface getQuizRequest extends Request {
  params: {
    quizId: string
  }
}

const getQuiz = async (req: getQuizRequest, res: Response) => {
  if (!req.params.quizId) {
    return sendInvalidInputResponse(res)
  }
  try {
    const quiz = await QuizModel.findById(req.params.quizId)
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
        sections: quiz?.sections,
      }

      // Get answered question IDs
      const answeredResponses = await ResponseModel.find({ status: 'answered', quizId: quiz._id })
      const answeredQuestionIds = answeredResponses.map((response) => response.questionId)

      // Get marked question IDs
      const markedResponses = await ResponseModel.find({ status: 'marked', quizId: quiz._id })
      const markedQuestionIds = markedResponses.map((response) => response.questionId)

      // Get markedanswered question IDs
      const markedAnsweredResponses = await ResponseModel.find({
        status: 'markedanswered',
        quizId: quiz._id,
      })
      const markedAnsweredQuestionIds = markedAnsweredResponses.map(
        (response) => response.questionId,
      )

      return res
        .status(200)
        .send({
          message: 'Quiz fetched',
          quiz: quizDetails,
          answeredQuestionIds,
          markedQuestionIds,
          markedAnsweredQuestionIds,
        })
    } else {
      return sendFailureResponse({
        res,
        error: 'Error fetching quiz, this quiz is not alive',
        messageToSend: 'Error fetching quiz, this quiz is not live',
        errorCode: 400,
      })
    }
  } catch (error: unknown) {
    sendFailureResponse({
      res,
      error,
      messageToSend: 'Failed to fetch quiz',
    })
  }
}

export default getQuiz
