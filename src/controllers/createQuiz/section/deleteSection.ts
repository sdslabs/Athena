import { Request, Response } from 'express'
import sendInvalidInputResponse from '@utils/invalidInputResponse'
import { JwtPayload } from 'types'
import getQuiz from '@utils/getQuiz'
import QuestionModel from '@models/question/questionModel'
import QuizModel from '@models/quiz/quizModel'
import sendFailureResponse from '@utils/failureResponse'

interface deleteSectionRequest extends Request {
  params: {
    quizId: string
    sectionIndex: string
  }
  body: {
    user: JwtPayload
  }
}

const deleteSection = async (req: deleteSectionRequest, res: Response) => {
  if (!req.body) {
    return sendInvalidInputResponse(res)
  }
  const quizId = req.params.quizId
  const sectionIndex = parseInt(req.params.sectionIndex, 10)
  const quiz = await getQuiz(quizId)

  if (!quiz) {
    return sendInvalidInputResponse(res)
  }

  const section = quiz?.sections?.[sectionIndex]
  if (!section) {
    return sendInvalidInputResponse(res)
  }
  try {
    await QuizModel.findByIdAndUpdate(
      quizId,
      { $pull: { sections: { $eq: section } } },
      { new: true },
    )

    section.questions?.forEach(async (questionId) => {
      await QuestionModel.findByIdAndDelete(questionId)
    })

    return res.status(200).json({
      message: 'Section Deleted',
    })
  } catch (err: unknown) {
    return sendFailureResponse({
      res,
      error: err,
      messageToSend: 'Failed to delete section',
    })
  }
}

export default deleteSection
