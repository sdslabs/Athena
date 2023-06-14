import { Request, Response } from "express";
import sendInvalidInputResponse from '@utils/invalidInputResponse'
import getQuiz from "@utils/getQuiz";
import QuizModel from "@models/quiz/quizModel";
import sendFailureResponse from "@utils/failureResponse";
import { JwtPayload } from "types";

interface updateSectionRequest extends Request {
    body: {
        section: {
            name: string
            description?: string
        }
        sectionIndex: number
        user: JwtPayload
    }
    params: {
        quizId: string
    }
}

const updateSection = async (req: updateSectionRequest, res: Response) => {
    if (!req.body) {
        return sendInvalidInputResponse(res)
    }
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
    try {
        await QuizModel.findByIdAndUpdate(quizId, {
            $set: {
                [`sections.${sectionIndex}`]: req.body.section
            }
        }, { new: true })

        // send success response
        return res.status(200).json({
            message: "Section Updated",
        })
    }
    catch (err: unknown) {
        return sendFailureResponse({
            res,
            error: err,
            messageToSend: 'Failed to update section',
        })
    }
}

export default updateSection;