import { Request, Response } from "express";
import QuizModel from "@models/quiz/quizModel";
import sendInvalidInputResponse from "@utils/invalidInputResponse";

interface getDashboardRequest extends Request {
    params: {
        quizId: string
    }
}

const getDashboard = async (req: getDashboardRequest, res: Response) => {
    const quizId = req.params.quizId
    const quiz = await QuizModel.findById(quizId).populate('sections.questions')
    if (!quiz) {
        return sendInvalidInputResponse(res);
    }
    let checksCompleted = 0;
    const sections = quiz?.sections?.map(section => {
        return {
            name: section.name,
            questions: section?.questions?.map(question => {
                checksCompleted += question.checkedAttempts || 0;
                return {
                    type: question.type,
                    description: question.description,
                    totalAttempts: question.totalAttempts,
                    checkedAttempts: question.checkedAttempts,
                    assignedTo: question.assignedTo
                }
            })
        }
    });
    return res.status(200).json({
        sections:sections,
        participants: quiz?.participants?.length,
        checksCompleted: checksCompleted
    })
}

export default getDashboard