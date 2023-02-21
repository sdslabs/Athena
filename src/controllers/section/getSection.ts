import { Request, Response } from "express";
import sendInvalidInputResponse from '@utils/invalidInputResponse'

interface getSectionRequest extends Request {
    params: {
        sectionId: string
    }
}

const getSectionById = async (req: getSectionRequest, res:Response) => {
    if (!req.body) {
        return sendInvalidInputResponse(res)
    }
    // TODO: implement get section
    res.send("section data received")
}

export default getSectionById;