import { Response, Request } from "express";
import { JwtPayload } from "types";

interface startQuizRequest extends Request {
    body:{
        user: JwtPayload,
    },
    params:{
        quizId: string,
    }
}

const startQuiz = async (req: startQuizRequest, res: Response) => {
    const { user } = req.body;
    const { quizId } = req.params;
}

export default startQuiz;