import { Request, Response } from "express";
import sendInvalidInputResponse from '@utils/invalidInputResponse'
import getQuiz from "@utils/getQuiz";
import QuizModel from "@models/quiz/quizModel";

interface updateSectionRequest extends Request {
    body: {
        section: {
            name: string
            description?: string
        }
        sectionIndex: number
    }
    params: {
        quizId: string
    }
}

const updateSection = async (req: updateSectionRequest, res:Response) => {
    if (!req.body) {
        return sendInvalidInputResponse(res)
    }
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

    const updatedQuiz = await QuizModel.findByIdAndUpdate(quizId, {
        $set:{
            [`sections.${sectionIndex}`]: req.body.section
        }
    }, {new: true})

    return res.send(updatedQuiz);
}

export default updateSection;