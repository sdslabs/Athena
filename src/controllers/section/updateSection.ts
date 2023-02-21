import { Request, Response } from "express";
import { IQuiz } from 'types'
import sendInvalidInputResponse from '@utils/invalidInputResponse'

interface updateSectionRequest extends Request {
    body: {
        sections: IQuiz['sections']
    }
    params: {
        sectionId: string
    }
}

const updateSectionByID = async (req: updateSectionRequest, res:Response) => {
    if (!req.body) {
        return sendInvalidInputResponse(res)
    }

    // TODO: implement update section
    res.send("updated section")
}

export default updateSectionByID;