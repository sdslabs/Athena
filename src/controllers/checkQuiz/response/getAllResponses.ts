import QuestionModel from "@models/question/questionModel";
import ResponseModel from "@models/response/responseModel";
import sendFailureResponse from "@utils/failureResponse";
import sendInvalidInputResponse from "@utils/invalidInputResponse";
import { Request, Response } from "express";

interface getAllResponsesRequest extends Request {
  params: {
    quizId: string,
    questionId: string
  }
}

const getAllResponses = async (req: getAllResponsesRequest, res: Response) => {
  const { quizId, questionId } = req.params;
  try {
    const question = await QuestionModel.findById(questionId);
    if (!question) {
      sendInvalidInputResponse(res);
    }
    const responses = await ResponseModel.find({ questionId, quizId }).populate({
      path: 'user',
      select: 'personalDetails.name'
    });
    const responsesToSend = responses.map(response => {
      return {
        name: response.user?.personalDetails?.name,
        responseId: response._id
      }
    });
    
    const firstResponse = await ResponseModel.findById(responsesToSend[0].responseId).populate({
      path: 'checkedBy',
      select: 'personalDetails.name personalDetails.emailAdd'
    });

    return res.status(200).json({
      responses: responsesToSend,
      firstResponse: {
        user: firstResponse?.user,
        selectedOptionId: firstResponse?.selectedOptionId,
        subjectiveAnswer: firstResponse?.subjectiveAnswer,
        marksAwarded: firstResponse?.marksAwarded,
        status: firstResponse?.status,
        checkedBy: firstResponse?.checkedBy
      }
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

export default getAllResponses