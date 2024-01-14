import { Response, Request } from 'express'
import QuizModel from '@models/quiz/quizModel'
import QuestionModel from '@models/question/questionModel'
import ResponseModel from '@models/response/responseModel'
import sendFailureResponse from '@utils/failureResponse'
import sendInvalidInputResponse from '@utils/invalidInputResponse'


interface deleteQuizRequest extends Request {
  params: {
    quizId: string
  }
}

const deleteQuiz = async (req: deleteQuizRequest, res: Response) => {
  if (!req.params.quizId) {
    return sendInvalidInputResponse(res)
  }

  try {
    // delete the quiz and all the questions present in quiz.sections.questions
    const quiz = await QuizModel.findById(req.params.quizId)
    if (!quiz) {
      return sendFailureResponse({
        res,
        error: 'Quiz not found',
        messageToSend: 'Quiz not found',
      })
    }
    const questionIds = quiz?.sections?.map((section) => section.questions).flat()
    await QuestionModel.deleteMany({ _id: { $in: questionIds } })
    await ResponseModel.deleteMany({ quizId: req.params.quizId })
    await QuizModel.findByIdAndDelete(req.params.quizId)
    return res.status(200).send({ message: 'Quiz deleted' })
  }
  catch (error: unknown) {
    sendFailureResponse({
      res,
      error,
      messageToSend: 'Failed to delete quiz',
    })
  }
}

export default deleteQuiz
