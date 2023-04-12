import { Request, Response } from "express";
import { JwtPayload, UserRoles } from 'types'
import sendInvalidInputResponse from '@utils/invalidInputResponse'
import unauthorizedResponse from '@utils/unauthorisedResponse'
import getQuiz from '@utils/getQuiz'

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

    const { section, user } = req.body
    const { quizId } = req.params;

    if (!section) {
        return sendInvalidInputResponse(res)
    }

    const quiz = await getQuiz(quizId);
    if (!quiz) {
        return sendInvalidInputResponse(res)
    }

    if (quiz.admin == user.userId || quiz?.managers?.includes(user.userId) || user.role == UserRoles.superAdmin) {
        try {
            quiz?.sections?.push(section)
            await quiz.save()
            return res.send({ quiz })
        }
        catch (err: unknown) {
            return res.status(500).send(err)
        }
    }
    else {
        return unauthorizedResponse(res)
    }
}

export default createSection;