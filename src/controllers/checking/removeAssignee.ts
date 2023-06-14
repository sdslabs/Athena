import QuestionModel from "@models/question/questionModel";
import sendFailureResponse from "@utils/failureResponse";
import sendInvalidInputResponse from "@utils/invalidInputResponse";
import { Request, Response } from "express";
import { Types } from "mongoose";
import { JwtPayload } from "types";

interface removeAssigneeRequest extends Request {
  params: {
    quizId: string,
    questionId: string
  },
  body: {
    assignee: Types.ObjectId,
    user: JwtPayload
  }
}

const removeAssignee = async (req: removeAssigneeRequest, res: Response) => {
  const questionId = req.params.questionId;
  const assignee = req.body.assignee;

  try {
    const question = QuestionModel.findById(questionId);
    if (!question) {
      sendInvalidInputResponse(res);
    }
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
