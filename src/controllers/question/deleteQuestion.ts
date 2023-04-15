import sendInvalidInputResponse from "@utils/invalidInputResponse";
import { Request, Response } from "express";
import QuestionModel from "@models/question/questionModel";
import { JwtPayload } from "types";
import { Types } from "mongoose";
import sendFailureResponse from "@utils/failureResponse";
import QuizModel from "@models/quiz/quizModel";

interface deleteQuestionRequest extends Request {
    body: {
        sectionIndex: number
        user: JwtPayload
        questionId: Types.ObjectId
    },
    params: {
        quizId: string
    },
}

const deleteQuestion = async (req: deleteQuestionRequest, res: Response) => {
    if (!req.body.questionId) {
        return sendInvalidInputResponse(res);
    }

    // get data from request body
    const { questionId } = req.body

    try {

        // delete questionId from quiz's section array
        const updateQuiz = await QuizModel.findOneAndUpdate(
            { "sections.questions": questionId },
            { $pull: { "sections.$.questions": questionId } },
            { new: true }
        )

        // delete question
        const question = await QuestionModel.findOneAndDelete({ _id: questionId })
        if(!question || !updateQuiz) {
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