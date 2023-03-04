import sendInvalidInputResponse from "@utils/invalidInputResponse";
import { Request, Response } from "express";
import QuestionModel from "@models/question/questionModel";
import { IQuiz } from "types";
import { Types } from "mongoose";
import QuizModel from "@models/quiz/quizModel";
import sendFailureResponse from "@utils/failureResponse";

interface getQuestionRequest extends Request {
    body: {
        questionId: Types.ObjectId
    },
    params: {
        quizId: string
    }
}

const getQuestion = async (req: getQuestionRequest, res: Response) => {
    if (!req.body.questionId || !req.params.quizId) {
        return sendInvalidInputResponse(res);
    }

    // get data from request body
    const { questionId } = req.body
    const { quizId } = req.params

    try {
        // finding question
        const question = await QuestionModel.findById(questionId)

        // send response
        if (!question) {
            return res.status(400).json({
                message: "Question not found"
            })
        } else {
            return res.status(200).json({
                message: "Question found",
                question
            })
        }
    } catch (error: unknown) {
        sendFailureResponse({
            res,
            error,
            messageToSend: "Failed to get question",
        })
    }
}

export default getQuestion