import { Request, Response } from "express";
import sendInvalidInputResponse from '@utils/invalidInputResponse'

interface deleteSectionRequest extends Request {
    params: {
        sectionId: string
    }
}

const deleteSection = async (req: deleteSectionRequest, res:Response) => {
    if (!req.body) {
        return sendInvalidInputResponse(res)
    }

    // TODO: implement delete section
    res.send("deleted section")
}

export default deleteSection;