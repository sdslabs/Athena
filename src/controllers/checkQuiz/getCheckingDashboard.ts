import { Request, Response } from 'express'
import QuizModel from '@models/quiz/quizModel'
import sendInvalidInputResponse from '@utils/invalidInputResponse'
import sendFailureResponse from '@utils/failureResponse'
import LeaderboardModel from '@models/leaderboard/leaderboardModel'
import UserModel from '@models/user/userModel';
import { Types } from "mongoose";

interface getDashboardRequest extends Request {
  params: {
    quizId: string
  }
}

interface UserDetails {
  userId: Types.ObjectId;
  name: string | undefined;
  phoneNumber: string | undefined ;
 }

const getCheckingDashboard = async (req: getDashboardRequest, res: Response) => {
  const quizId = req.params.quizId
  const users: UserDetails[] = [];
  try {
    const quiz = await QuizModel.findById(quizId).populate({
      path: 'sections',
      select: 'name questions',
      populate: {
        path: 'questions',
        select: 'type description totalAttempts checkedAttempts assignedTo',
        populate: {
          path: 'assignedTo',
          select: 'personalDetails.name personalDetails.emailAdd',
        },
      },
    })
    if (!quiz) {
      return sendInvalidInputResponse(res)
    }
    let checksCompleted = 0
    let totalAttempts = 0
    quiz?.sections?.forEach((section) => {
      section?.questions?.forEach((question) => {
        checksCompleted += question?.checkedAttempts || 0
        totalAttempts += question?.totalAttempts || 0
      })
    })   
    const leaderboard = await LeaderboardModel.find({ quizId: quizId })

    for (let i = 0; i < leaderboard.length; i++) {
      for (let j = 0; j < leaderboard[i].participants.length; j++) {
        const userId = leaderboard[i].participants[j].userId;
        const user = await UserModel.findById(userId);
        console.log("userrrr",user);
        if(user){
        users.push({
          userId: user._id,
          name: user.personalDetails?.name,
          phoneNumber: user.personalDetails?.phoneNo
        });
      }
      }
    }

    return res.status(200).json({
      admin: quiz.admin,
      scheduled: quiz.quizMetadata?.startDateTimestamp,
      sections: quiz.sections,
      participants: quiz?.participants?.length,
      checksCompleted: checksCompleted,
      totalAttempts: totalAttempts,
      leaderboard: leaderboard,
      users : users,
      name: quiz?.quizMetadata?.name,
    })
  } catch (error: unknown) {
    return sendFailureResponse({
      res,
      error,
      messageToSend: 'Failed to get checking dashboard',
    })
  }
}

export default getCheckingDashboard
