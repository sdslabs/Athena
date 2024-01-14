import { Request, Response } from "express";
import { JwtPayload } from 'types'
import sendInvalidInputResponse from '@utils/invalidInputResponse'
import getQuiz from '@utils/getQuiz'
import sendFailureResponse from "@utils/failureResponse";

interface createSectionRequest extends Request {
    body: {
        user: JwtPayload
    }
    params: {
        quizId: string
    }
}

const createSection = async (req: createSectionRequest, res: Response) => {
    if (!req.body) {
        return sendInvalidInputResponse(res)
    }

    const { quizId } = req.params;

    try {
        const quiz = await getQuiz(quizId);
        if (!quiz) {
            return sendInvalidInputResponse(res)
        }
        quiz?.sections?.push({
            name: 'Section ' + (quiz?.sections?.length + 1),
            instructions: '',
            questions: []
        
        })
        await quiz.save()
        return res.status(200).json({
            message: "Section Created",
        })
    }
    catch (err: unknown) {
        return sendFailureResponse({
            res,
            error: err,
            messageToSend: 'Failed to create section',
        })
    }
}

export default createSection;