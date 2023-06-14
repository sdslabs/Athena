import sendInvalidInputResponse from '@utils/invalidInputResponse'
import { Request, Response } from 'express'
import QuizModel from '@models/quiz/quizModel'
import sendFailureResponse from '@utils/failureResponse'
import { JwtPayload } from 'types'

interface publishQuizRequest extends Request {
    body: {
        user: JwtPayload
    }
    params: {
        quizId: string
    }
}

const publishQuiz = async (req: publishQuizRequest, res: Response) => {
    if (!req.body.user || !req.params.quizId) {
        return sendInvalidInputResponse(res)
    }

    const quizId = req.params.quizId

    try {
        // publish the quiz
        const publishedQuiz = await QuizModel.findByIdAndUpdate(
            quizId,
            { isPublished: true },
            { new: true }
        )

        // send the response back
        if (!publishedQuiz) {
            return sendFailureResponse({
                res,
                error: 'Error publishing quiz',
                messageToSend: 'Error publishing quiz',
                errorCode: 404
            })
        } else {
            return res.status(200).send({ message: 'Quiz published', quizId: publishedQuiz._id })
        }
    } catch (error) {
        return sendFailureResponse({
            res,
            error,
            messageToSend: 'Failed to publish quiz',
        })
    }

}

export default publishQuiz