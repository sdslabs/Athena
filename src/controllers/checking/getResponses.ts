import QuestionModel from "@models/question/questionModel";
import ResponseModel from "@models/response/responseModel";
import sendFailureResponse from "@utils/failureResponse";
import sendInvalidInputResponse from "@utils/invalidInputResponse";
import { Request, Response } from "express";

interface getResponsesRequest extends Request {
  params: {
    quizId: string,
    questionId: string
  }
}

const getResponses = async (req: getResponsesRequest, res: Response) => {
  const { quizId, questionId } = req.params;
  try {
    const question = await QuestionModel.findById(questionId);
    if (!question) {
      sendInvalidInputResponse(res);
    }
    const responses = await ResponseModel.find({
      question: questionId,
      quiz: quizId
    });
    return res.status(200).json({
      responses: responses
    });
  }
  catch (error: unknown) {
    return sendFailureResponse({
      res,
      error,
      messageToSend: "Failed to get responses"
    });
  }
}

export default getResponses