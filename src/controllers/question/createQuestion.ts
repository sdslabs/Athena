import sendInvalidInputResponse from "@utils/invalidInputResponse";
import { Request, Response } from "express";
import QuestionModel from "@models/question/questionModel";
import QuizModel from "@models/quiz/quizModel";
import { IQuestion, JwtPayload } from "types";
import sendFailureResponse from "@utils/failureResponse";

interface createQuestionRequest extends Request {
    body: {
        question: IQuestion
        sectionIndex: number
        user: JwtPayload
    },
    params: {
        quizId: string
    }
}

const createQuestion = async (req: createQuestionRequest, res: Response) => {
    if (!req.body.question || !req.body.sectionIndex) {
        return sendInvalidInputResponse(res);
    }

    // get data from request body
    const { question, sectionIndex } = req.body
    const { quizId } = req.params

    try {

        // create new question
        const newQuestion = new QuestionModel(
            question
        )
        const newQuestionDoc = await newQuestion.save()

        // add question to section
        const updateSection = await QuizModel.findByIdAndUpdate(
            quizId,
            {
                $push: {
                    [`sections.${sectionIndex}.questions`]: newQuestionDoc._id
                }
            }
        )

        // send response
        if (!updateSection) {
            return sendFailureResponse({
                res,
                error: "Failed to create question",
                messageToSend: "Failed to create question",
            })
        } else {
            return res.status(201).json({
                message: "Question created",
            })
        }

    } catch (error: unknown) {
        sendFailureResponse({
            res,
            error,
            messageToSend: "Failed to create question",
        })
    }

}

export default createQuestion