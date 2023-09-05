import { Request, Response } from "express";
import sendInvalidInputResponse from '@utils/invalidInputResponse'
import { JwtPayload } from "types";
import getQuiz from "@utils/getQuiz";

interface getSectionRequest extends Request {
    params: {
        quizId: string
    }
    body: {
        user: JwtPayload
        sectionIndex: number
    }
}

const getSection = async (req: getSectionRequest, res: Response) => {
    if (!req.body) {
        return sendInvalidInputResponse(res)
    }
    const quizId = req.params.quizId;
    const sectionIndex = req.body.sectionIndex;
    const quiz = await getQuiz(quizId);

    if (!quiz) {
        return sendInvalidInputResponse(res);
    }

    const section = quiz?.sections?.[sectionIndex];
    if (!section) {
        return sendInvalidInputResponse(res);
    }
    return res.send(section);
}

export default getSection;