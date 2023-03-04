import sendInvalidInputResponse from "@utils/invalidInputResponse";
import { Request, Response } from "express";
import QuestionModel from "@models/question/questionModel";
import QuizModel from "@models/quiz/quizModel";
import { IQuestion, QuestionTypes } from "types";
import { Types } from "mongoose";
import sendFailureResponse from "@utils/failureResponse";

interface createQuestionRequest extends Request {
    body: {
        question: IQuestion
        userId : Types.ObjectId
        sectionName : string
    },
    params: {
        quizId: string
    }
}

const createQuestion = async (req: createQuestionRequest, res: Response) => {
    if (!req.body.question || !req.params.quizId || !req.body.sectionName || !req.body.userId) {
        return sendInvalidInputResponse(res);
    }

    // get data from request body
    const { question, userId, sectionName } = req.body
    const { quizId } = req.params

    try {
        // create new question
        const newQuestion = new QuestionModel(
            question
        )
        const newQuestionDoc = await newQuestion.save()

        // add question to quiz with particular section
        const updateSection = await QuizModel.findOneAndUpdate(
            { _id: quizId, "sections.name": sectionName },
            { $push: { "sections.$.questions": newQuestionDoc._id } },
            { new: true }
        )

        // send response
        if (!updateSection) {
            return res.status(400).json({
                message: "Failed to add question to section"
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