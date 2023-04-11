import { Request, Response } from "express";
import sendInvalidInputResponse from '@utils/invalidInputResponse'
import { JwtPayload } from "types";
import getQuiz from "@utils/getQuiz";
import QuestionModel from "@models/question/questionModel";
import QuizModel from "@models/quiz/quizModel";

interface deleteSectionRequest extends Request {
    params: {
        quizId: string
    }
    body: {
        user: JwtPayload
        sectionIndex: number
    }
}

const deleteSection = async (req: deleteSectionRequest, res:Response) => {
    if (!req.body) {
        return sendInvalidInputResponse(res)
    }
    const quizId = req.params.quizId;
    const sectionIndex = req.body.sectionIndex;
    const quiz = await getQuiz(quizId);

    if(!quiz){
        return sendInvalidInputResponse(res);
    }

    const section = quiz?.sections?.[sectionIndex];
    if(!section){
        return sendInvalidInputResponse(res);
    }
    section.questions?.forEach(async (questionId) => {
        await QuestionModel.findByIdAndDelete(questionId);
    })

    const updatedQuiz = await QuizModel.findByIdAndUpdate(quizId, {
        $unset:{
            [`sections.${sectionIndex}`]: 1
        },
        $pull:{
            [`sections`]: null
        }
    }, {new: true});
    
    return res.send(updatedQuiz);
}

export default deleteSection;