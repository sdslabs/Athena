import { Request, Response } from 'express'
import sendFailureResponse from '@utils/failureResponse'
import sendInvalidInputResponse from '@utils/invalidInputResponse'
import QuizModel from '@models/quiz/quizModel'
import ResponseModel from '@models/response/responseModel'
import { JwtPayload, ResponseStatus } from 'types'
import isParticipant from '@utils/isParticipant'
import { Types } from 'mongoose'

interface getQuizRequest extends Request {
  params: {
    quizId: string
  }
  body: {
    user: JwtPayload
  }
}

const getQuiz = async (req: getQuizRequest, res: Response) => {
  const { user } = req.body
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

      console.log(user);

      const userObjectId = new Types.ObjectId(user.userId)
      const dbUser = isParticipant(userObjectId, quiz?.participants)
      if(!dbUser){
        return sendFailureResponse({
          res,
          error: 'Error fetching quiz, Invalid User' ,
          messageToSend: 'Error fetching quiz, User does not exist',
          errorCode: 400,
        })
      }
    
      if (dbUser?.submitted) {
        return sendFailureResponse({
          res,
          error: 'Error fetching quiz, User has already submitted the quiz' ,
          messageToSend: 'Error fetching quiz, User has already submitted the quiz',
          errorCode: 400,
        })
      }

      const answeredResponses = await ResponseModel.find({ status: ResponseStatus.answered, quizId: quiz._id, userId: user.userId })
      const answeredQuestionIds = answeredResponses.map((response) => response.questionId)

      const markedResponses = await ResponseModel.find({ status: ResponseStatus.marked, quizId: quiz._id, userId: user.userId })
      const markedQuestionIds = markedResponses.map((response) => response.questionId)

      const markedAnsweredResponses = await ResponseModel.find({ status: ResponseStatus.markedanswer, quizId: quiz._id, userId: user.userId })
      const markedAnsweredQuestionIds = markedAnsweredResponses.map( (response) => response.questionId,)

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
        error: 'Error fetching quiz, this quiz is not live',
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
