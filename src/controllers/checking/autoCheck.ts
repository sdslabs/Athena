import { Request, Response } from "express";
import sendFailureResponse from "@utils/failureResponse";
import QuestionModel from "@models/question/questionModel";
import { QuestionTypes } from "types";
import QuizModel from "@models/quiz/quizModel";
import ResponseModel from "@models/response/responseModel";

interface autoCheckRequest extends Request {
  params: {
    quizId: string
  }
}
const autoCheck = async (req: autoCheckRequest, res: Response) => {
  const quizId = req.params.quizId;
  try {
    await QuestionModel.updateMany({ quiz: quizId, type: QuestionTypes.MCQ }, { autoCheck: true });
    const quiz = await QuizModel.findById(quizId).populate({
        path: 'sections.questions',
        select: 'type correctAnswer maxMarks _id',
      }
    );
    quiz?.sections?.forEach(async section => {
      section?.questions?.forEach(async question => {
        if (question.type === QuestionTypes.MCQ) {
          await ResponseModel.updateMany({ quizId: quizId, questionId: question._id }, {
            $set: {
              marksAwarded: {
                $cond: {
                  if: { $eq: ["$selectedOptionID", question.correctAnswer] },
                  then: question.maxMarks,
                  else: 0
                }
              }
            }
          });
          await QuestionModel.findByIdAndUpdate(question._id, { autoCheck: true });
        }
      })
    });
  }
  catch (error: unknown) {
    return sendFailureResponse({
      res,
      error,
      messageToSend: "Failed to autocheck answers"
    })
  }
}
export default autoCheck;