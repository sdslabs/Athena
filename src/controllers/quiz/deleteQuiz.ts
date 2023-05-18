import { Response, Request } from 'express'
import QuizModel from '@models/quiz/quizModel'
import sendFailureResponse from '@utils/failureResponse'
import sendInvalidInputResponse from '@utils/invalidInputResponse'
import getQuiz from '@utils/getQuiz'

interface deleteQuizRequest extends Request {
  params: {
    quizId: string
  }
}

const deleteQuiz = async (req: deleteQuizRequest, res: Response) => {
  if (!req.params.quizId) {
    return sendInvalidInputResponse(res)
  }

  const quiz = await getQuiz(req.params.quizId)
  if (!quiz) {
    return sendInvalidInputResponse(res)
  }

  try {
    const deletedQuiz = await QuizModel.findByIdAndDelete(req.params.quizId);
    return res.status(200).send({ message: 'Quiz deleted', deletedQuiz })
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
