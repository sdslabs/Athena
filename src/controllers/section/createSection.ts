import { Request, Response } from "express";
import { IQuiz } from 'types'
import sendInvalidInputResponse from '@utils/invalidInputResponse'

interface createSectionRequest extends Request {
    body: {
      sections: IQuiz['sections']
    }
    params: {
        quizId: string
    }
}

const createSection = async (req: createSectionRequest, res:Response) => {
    if (!req.body) {
        return sendInvalidInputResponse(res)
    }

    const {sections} = req.body

    if (!sections) {
        return sendInvalidInputResponse(res)
    }

    // TODO: implement create section
    res.send("create section")
}

export default createSection;