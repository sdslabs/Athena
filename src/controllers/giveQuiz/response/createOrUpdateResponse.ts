import { Response, Request } from 'express'
import ResponseModel from '@models/response/responseModel'
import { JwtPayload, IResponse } from 'types'
import sendFailureResponse from '@utils/failureResponse'
import sendInvalidInputResponse from '@utils/invalidInputResponse'
import QuestionModel from '@models/question/questionModel'
import getQuiz from '@utils/getQuiz'
import { Types } from 'mongoose'
import isParticipant from '@utils/isParticipant'

interface createOrUpdateResponseRequest extends Request {
  body: {
    user: JwtPayload
    selectedOptionId?: IResponse['selectedOptionId']
    subjectiveAnswer?: IResponse['subjectiveAnswer']
    status: IResponse['status']
  }
  params: {
    quizId: string
    questionId: string
  }
}

const createOrUpdateResponse = async (req: createOrUpdateResponseRequest, res: Response) => {
  if (!req.body || !req.body.status) {
    return sendInvalidInputResponse(res)
  }
  const { user, selectedOptionId, subjectiveAnswer, status } = req.body
  try {
    const question = await QuestionModel.findById(req.params.questionId)
    if (!question) {
      return sendInvalidInputResponse(res)
    }

    const quiz = await getQuiz(req.params.quizId)
    // check if the quiz is accepting answers
    if (quiz?.isAcceptingAnswers === false) {
      return sendFailureResponse({
        res,
        errorCode: 400,
        error: new Error('Quiz is not accepting answers'),
        messageToSend: 'Quiz is not accepting answers',
      })
    }

    const userObjectId = new Types.ObjectId(user.userId)
    const dbUser = isParticipant(userObjectId, quiz?.participants)
    if (!dbUser) {
      return sendFailureResponse({
        res,
        error: 'Error fetching quiz, Invalid User',
        messageToSend: 'Error fetching quiz, User does not exist',
        errorCode: 400,
      })
    }

    if (dbUser?.submitted) {
      return sendFailureResponse({
        res,
        error: 'Error fetching quiz, User has already submitted the quiz',
        messageToSend: 'Error fetching quiz, User has already submitted the quiz',
        errorCode: 400,
      })
    }
    // no need to check the question type etc as the data is being sent by the frontend and we will have cors enabled for the frontend only
    // TODO: use the following upsert type of query to update the response
    // const result = await ResponseModel.updateOne(
    //   {
    //     userId: user.userId,
    //     quizId: req.params.quizId,
    //     questionId: req.params.questionId,
    //   },
    //   {
    //     $set: {
    //       userId: user.userId,
    //       quizId: req.params.quizId,
    //       questionId: req.params.questionId,
    //       subjectiveAnswer,
    //       selectedOptionId,
    //       status,
    //     },
    //   },
    //   { upsert: true }
    // );
    const response = await ResponseModel.findOne({
      userId: user.userId,
      quizId: req.params.quizId,
      questionId: req.params.questionId,
    })
    if (!response) {
      const newResponse = new ResponseModel({
        userId: user.userId,
        quizId: req.params.quizId,
        questionId: req.params.questionId,
        subjectiveAnswer,
        selectedOptionId,
        status,
      })
      await newResponse.save()
      res.status(201).json({ message: 'Response created' })
    } else {
      await ResponseModel.findByIdAndUpdate(response._id, {
        selectedOptionId,
        subjectiveAnswer,
        status,
      })
      return res.status(200).json({ message: 'Response updated' })
    }
  } catch (error: unknown) {
    sendFailureResponse({
      res,
      error,
      messageToSend: 'Failed to create response',
    })
  }
}

export default createOrUpdateResponse
