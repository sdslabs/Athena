import { Request, Response } from "express";
import { JwtPayload } from 'types'
import sendInvalidInputResponse from '@utils/invalidInputResponse'
import getQuiz from '@utils/getQuiz'
import sendFailureResponse from "@utils/failureResponse";

interface createSectionRequest extends Request {
    body: {
        section: {
            name: string
            description?: string
        }
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

    const { section } = req.body
    const { quizId } = req.params;

    if (!section) {
        return sendInvalidInputResponse(res)
    }

    const quiz = await getQuiz(quizId);
    if (!quiz) {
        return sendInvalidInputResponse(res)
    }

    try {
        quiz?.sections?.push(section)
        await quiz.save()
        return res.send({ quiz })
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