import QuestionModel from "@models/question/questionModel";
import sendFailureResponse from "@utils/failureResponse";
import getQuiz from "@utils/getQuiz";
import sendInvalidInputResponse from "@utils/invalidInputResponse";
import { Request, Response } from "express";
import { Types } from "mongoose";


interface addAssigneeRequest extends Request {
  params: {
    quizId: string,
    questionId: string
  },
  body: {
    assignee: Types.ObjectId
  }
}

const addAssignee = async (req: addAssigneeRequest, res: Response) => {
  const quizId = req.params.quizId;
  const questionId = req.params.questionId;
  const assignee = req.body.assignee;
  const quiz = getQuiz(quizId);
  if (!quiz) {
    sendInvalidInputResponse(res);
  }
  const question = await QuestionModel.findById(questionId);
  if (!question) {
    sendInvalidInputResponse(res);
  }
  question?.assignedTo?.push(assignee);
  try {
    await question?.save();
    return res.status(200).json({
      message: "Assignee added successfully"
    })
  }
  catch (error: unknown) {
    sendFailureResponse({
      res,
      error,
      messageToSend: "Failed to add assignee"
    })
  }
}

export default addAssignee