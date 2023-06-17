import { Response, Request } from 'express'
import QuizModel from '@models/quiz/quizModel'
import { Error, Types } from 'mongoose'
import { IQuiz, JwtPayload } from 'types'
import sendFailureResponse from '@utils/failureResponse'
import sendInvalidInputResponse from '@utils/invalidInputResponse'

interface startQuizRequest extends Request {
    body:{
        user: JwtPayload,
        accessCode: string,
    },
    params:{
        quizId: string,
    }
}

const startQuiz = async (req: startQuizRequest, res: Response) => {
    const { user, accessCode } = req.body;
    const { quizId } = req.params;

    if (!user || !accessCode) {
        return sendInvalidInputResponse(res);
    }

    try {

        const quiz = await QuizModel.findById(quizId);
        
        if (!quiz || !quiz.isPublished) {
            return sendInvalidInputResponse(res)
        }

        if (quiz.quizMetadata?.accessCode !== accessCode) {
            return res.status(401).json({
                success: false,
                message: 'Invalid access code'
            })
        }

        // set isGivingQuiz to true for the user
        quiz.participants?.forEach((participant) => {
            if (participant.user === user.userId) {
                participant.isGivingQuiz = true;
            }
        })

        // TODO: set the time for the user (left b/c brain not working rn)
        // const startTime = Date.now();
        // const leftTime = min(quizEndingTime-startTime, participant.time.left)
        // quiz.participants?.forEach((participant) => {
        //     if (participant.user === user.userId) {
        //         participant.time.started = startTime;
        //         participant.time.left = leftTime;
        //     }
        // })

        // Return the time left to the user

        await quiz.save();
        return res.status(200).json({
            success: true,
            message: 'Quiz started successfully'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export default startQuiz;