import QuestionModel from "@models/question/questionModel";
import sendFailureResponse from "@utils/failureResponse";
import getQuiz from "@utils/getQuiz";
import sendInvalidInputResponse from "@utils/invalidInputResponse";
import { Request, Response } from "express";
import { Types } from "mongoose";

interface removeAssigneeRequest extends Request {
  params: {
    quizId: string,
    questionId: string
  },
  body: {
    assignee: Types.ObjectId
  }
}

const removeAssignee = async (req: removeAssigneeRequest, res: Response) => {
  const quizId = req.params.quizId;
  const questionId = req.params.questionId;
  const assignee = req.body.assignee;
  const quiz = getQuiz(quizId);
  if (!quiz) {
    sendInvalidInputResponse(res);
  }
  const question = QuestionModel.findById(questionId);
  if (!question) {
    sendInvalidInputResponse(res);
  }

  try {
    QuestionModel.findByIdAndUpdate(questionId, {
      $pull: {
        assignedTo: assignee
      }
    });
  }
  catch (error: unknown) {
    sendFailureResponse({
      res,
      error,
      messageToSend: "Failed to remove assignee"
    })
  }
}

export default removeAssignee
