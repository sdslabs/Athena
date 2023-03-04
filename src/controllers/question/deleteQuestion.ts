import sendInvalidInputResponse from "@utils/invalidInputResponse";
import { Request, Response } from "express";
import QuestionModel from "@models/question/questionModel";
import { IQuiz } from "types";
import { Types } from "mongoose";
import sendFailureResponse from "@utils/failureResponse";

interface deleteQuestionRequest extends Request {
    params: {
        questionId: string
    },
}

const deleteQuestion = async (req: deleteQuestionRequest, res: Response) => {
    if (!req.params.questionId) {
        return sendInvalidInputResponse(res);
    }

    // get data from request body
    const { questionId } = req.params

    try {
        const question = await QuestionModel.findOneAndDelete({ _id: questionId })
        if(!question) {
            return res.status(400).json({
                message: "Question not found"
            })
        } else {
            return res.status(200).json({
                message: "Question deleted",
            })
        }
    } catch (error: unknown) {
        sendFailureResponse({
            res,
            error,
            messageToSend: "Failed to delete question",
        })
    }
}

export default deleteQuestion