import { Response, Request } from 'express'
import QuizModel from '@models/quiz/quizModel'
import { JwtPayload } from 'types'
import sendInvalidInputResponse from '@utils/invalidInputResponse'
import sendFailureResponse from '@utils/failureResponse'

interface submitQuizRequest extends Request {
    body:{
        user: JwtPayload,
    },
    params:{
        quizId: string,
    }
}

//commented out for testing
const submitQuiz = async (req: submitQuizRequest, res: Response) => {
    // const { user } = req.body;
    const quizId  = '64f03422df4af65f96380c43'
    console.log("submit called")
    const userId = "64f03422df4af65f96380c3e"; 

    // if (!user) {
    //     return sendInvalidInputResponse(res);
    // }

    try {

        const quiz = await QuizModel.findById(quizId);
        
        if (!quiz || !quiz.isPublished) {
            return sendInvalidInputResponse(res)
        }
        console.log(userId)
        quiz.participants?.forEach((participant) => {
          console.log(participant.user.toString())
        })

        // set isGivingQuiz to true for the user
        quiz.participants?.forEach((participant) => {
            if (participant.user.toString() === userId) {
                participant.isGivingQuiz = false;
                participant.time.left = 0;
                participant.submitted = true;
                console.log("mongo good")
            }
        })

        await quiz.save();

        return res.status(200).json({
            success: true,
            message: 'Quiz submitted successfully'
        })

    } catch (err) {
        return sendFailureResponse({ res, error: err, messageToSend: 'Error while submitting quiz' })
    }
}

export default submitQuiz