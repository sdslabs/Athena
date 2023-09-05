import { Response, Request } from "express";
import ResponseModel from "@models/response/responseModel";
import { JwtPayload } from "types";
import sendFailureResponse from "@utils/failureResponse";
import sendInvalidInputResponse from "@utils/invalidInputResponse";

interface getResponseRequest extends Request {
  body: {
    user: JwtPayload;
  };
  params:{
    quizId: string
    questionId: string
  }
}

const getResponse = async (req: getResponseRequest, res: Response) => {
  if (!req.body) {
    return sendInvalidInputResponse(res);
  }

  const { user } = req.body;
  const { quizId, questionId } = req.params;

  try {
    const response = await ResponseModel.find({ questionId, quizId, userId: user.userId });
    if(!response) {
      return sendInvalidInputResponse(res);
    }
    res.status(200).json({
      message: "Responses fetched",
      response,
    });
  } catch (error: unknown) {
    sendFailureResponse({
      res,
      error,
      messageToSend: "Failed to fetch response",
    });
  }
};

export default getResponse;