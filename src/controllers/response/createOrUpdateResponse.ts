import { Response, Request } from "express";
import ResponseModel from "@models/response/responseModel";
import { JwtPayload, IResponse, QuestionTypes } from "types";
import sendFailureResponse from "@utils/failureResponse";
import sendInvalidInputResponse from "@utils/invalidInputResponse";
import QuestionModel from "@models/question/questionModel";


interface createOrUpdateResponseRequest extends Request {
  body: {
    user: JwtPayload;
    selectedOptionId?: IResponse['selectedOptionId']
    subjectiveAnswer?: IResponse['subjectiveAnswer']
    status: IResponse['status']
  }
  params: {
    quizId: string
    questionId: string
  }
}

const createOrUpdateResponse = async (req: createOrUpdateResponseRequest, res: Response) => {
  if (!req.body || !(req.body.selectedOptionId || req.body.subjectiveAnswer) || !req.body.status) {
    return sendInvalidInputResponse(res)
  }
  const { user, selectedOptionId, subjectiveAnswer, status } = req.body;
  try {
    const question = await QuestionModel.findById(req.params.questionId);
    if (!question) {
      return sendInvalidInputResponse(res);
    }
    if (question.type === QuestionTypes.SUBJECTIVE && !subjectiveAnswer) {
      return sendInvalidInputResponse(res);
    }
    if (question.type === QuestionTypes.MCQ && !selectedOptionId) {
      return sendInvalidInputResponse(res);
    }
    const response = await ResponseModel.findOne({ userId: user.userId, quizId: req.params.quizId, questionId: req.params.questionId });
    if (!response) {
      if (question.type === QuestionTypes.SUBJECTIVE) {
        const newResponse = new ResponseModel({
          userId: user.userId,
          quizId: req.params.quizId,
          questionId: req.params.questionId,
          subjectiveAnswer,
          status
        });
        await newResponse.save();
        res.status(201).json({ message: "Response created" });
      }
      else if (question.type === QuestionTypes.MCQ) {
        const newResponse = new ResponseModel({
          userId: user.userId,
          quizId: req.params.quizId,
          questionId: req.params.questionId,
          selectedOptionId,
          status
        });
        await newResponse.save();
        res.status(201).json({ message: "Response created" });
      }
    }
    else {
      if (question.type === QuestionTypes.SUBJECTIVE) {
        await ResponseModel.findByIdAndUpdate(response._id, { subjectiveAnswer, status });
        return res.status(200).json({ message: "Response updated" });
      }
      else if (question.type === QuestionTypes.MCQ) {
        await ResponseModel.findByIdAndUpdate(response._id, { selectedOptionId, status });
        return res.status(200).json({ message: "Response updated" });
      }
    }
  }
  catch (error: unknown) {
    sendFailureResponse({
      res,
      error,
      messageToSend: "Failed to create response",
    });
  }
}



export default createOrUpdateResponse;

