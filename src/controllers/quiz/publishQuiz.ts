import sendInvalidInputResponse from '@utils/invalidInputResponse'
import { Request, Response } from 'express'
import QuizModel from '@models/quiz/quizModel'
import { Types } from 'mongoose'

interface publishQuizRequest extends Request {
    body: {
        userId: Types.ObjectId
    }
    params: {
        quizId: string
    }
}

const publishQuiz = async (req: publishQuizRequest, res: Response) => {
    if(!req.body.userId || !req.params.quizId) {
        return sendInvalidInputResponse(res)
    }

    // get the data from the request body
    const { userId } = req.body
    const quizId = req.params.quizId

    try {
        // publish the quiz
        const publishedQuiz = await QuizModel.findOneAndUpdate(
            { _id: quizId, admin: userId },
            { isPublished: true },
            { new: true }
        )
        
        // send the response back
        if(!publishedQuiz) {
            return res.status(404).send({ message: 'Error publishing quiz' })
        } else {
            return res.status(200).send({ message: 'Quiz published', quizId: publishedQuiz._id })
        }
    } catch (error) {
        return res.status(500).send({ message: 'Error publishing quiz' })
    }

}

export default publishQuiz