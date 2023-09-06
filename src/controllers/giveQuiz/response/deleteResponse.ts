import { Response, Request } from "express";
import ResponseModel from "@models/response/responseModel";
import { JwtPayload} from "types";
import sendFailureResponse from "@utils/failureResponse";
import sendInvalidInputResponse from "@utils/invalidInputResponse";

interface deleteResponseRequest extends Request {
  body: {
    user: JwtPayload;
  };
  params: {
    quizId: string;
    questionId: string;
  };
}

const deleteResponse = async (req: deleteResponseRequest, res: Response) => {
  const { user } = req.body;
  const { quizId, questionId } = req.params;
  try {
    const response = await ResponseModel.findOne({ userId: user.userId, quizId, questionId });
    if (!response) {
      return sendInvalidInputResponse(res);
    }
    await response.delete();
    res.status(200).json({ message: "Response deleted" });

  } catch (error: unknown) {
    sendFailureResponse({
      res,
      error,
      messageToSend: "Failed to delete response",
    });
  }
}

export default deleteResponse;