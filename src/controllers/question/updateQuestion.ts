import sendInvalidInputResponse from "@utils/invalidInputResponse";
import { Request, Response } from "express";
import QuestionModel from "@models/question/questionModel";
import { IQuestion, IQuiz } from "types";
import { Types } from "mongoose";
import sendFailureResponse from "@utils/failureResponse";

interface updateQuestionRequest extends Request {
    body: {
        question: IQuestion
        userId : Types.ObjectId
    },
    params: {
        questionId: string
    }
}

const updateQuestion = async (req: updateQuestionRequest, res: Response) => {
    if (!req.params.questionId || !req.body.question || !req.body.userId) {
        return sendInvalidInputResponse(res);
    }

    // get data from request body
    const { question, userId } = req.body
    const { questionId } = req.params

    try {
        // find question and update
        const updatedQuestion = await QuestionModel.findOneAndUpdate(
            { _id: questionId },
            question,
            { new: true }
        )

        // send response
        if (!updatedQuestion) {
            return res.status(400).json({
                message: "Question not found"
            })
        } else {
            return res.status(200).json({
                message: "Question updated",
            })
        }
    } catch (error: unknown) {
        sendFailureResponse({
            res,
            error,
            messageToSend: "Failed to update question",
        })
    }
}

export default updateQuestion