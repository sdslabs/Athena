import { Request, Response } from 'express'
import sendFailureResponse from '@utils/failureResponse'
import QuizModel from '@models/quiz/quizModel'
import { JwtPayload } from 'types'
import UserModel from '@models/user/userModel'

interface getDashBoardRequest extends Request {
  body: {
    user: JwtPayload
  }
}

const getDashBoard = async (req: getDashBoardRequest, res: Response) => {
  const user = req.body.user
  try {
    const createdQuizzes = await QuizModel.find({
      $or: [{ admin: user.userId }, { managers: user.userId }],
    })
    const quizzes = await QuizModel.find({})
    let attemptedQuizzes = 0
    const quizDetails = quizzes
      .filter((quiz) => quiz.isPublished) // Filter out unpublished quizzes
      .map((quiz) => {
        if (quiz?.isPublished) {
          const userStatus = quiz?.participants?.find(
            (participant) => participant.userId && participant.userId.equals(user.userId),
          )
          if (userStatus?.submitted) {
            attemptedQuizzes += 1
          }
          return {
            _id: quiz._id,
            name: quiz?.quizMetadata?.name,
            description: quiz?.quizMetadata?.description,
            instructions: quiz?.quizMetadata?.instructions,
            startDateTimestamp: quiz?.quizMetadata?.startDateTimestamp,
            endDateTimestamp: quiz?.quizMetadata?.endDateTimestamp,
            bannerImage: quiz?.quizMetadata?.bannerImage,
            isAcceptingAnswers: quiz?.isAcceptingAnswers,
            registrationMetadata: quiz?.registrationMetadata,
            isAccessCodePresent: quiz?.quizMetadata?.accessCode
              ? quiz?.quizMetadata?.accessCode.length > 0
                ? true
                : false
              : false,
            registered: userStatus ? true : false,
            submitted: userStatus?.submitted,
          }
        }
      })
    const userDocument = await UserModel.findById(user.userId)
    const userDetails = {
      firstName: userDocument?.personalDetails?.name.split(' ')[0] || '',
      lastName: userDocument?.personalDetails?.name.split(' ')[1] || '',
      emailAdd: userDocument?.personalDetails?.emailAdd,
      phoneNo: userDocument?.personalDetails?.phoneNo,
      instituteName: userDocument?.educationalDetails?.instituteName,
    }
    return res.status(200).send({
      message: 'Dashboard details fetched',
      createdQuizzes: createdQuizzes,
      quizzes: quizDetails,
      attemptedQuizzes: attemptedQuizzes,
      hostedQuizzes: createdQuizzes.length,
      userDetails: userDetails,
    })
  } catch (error: unknown) {
    sendFailureResponse({
      res,
      error,
      messageToSend: 'Failed to fetch dashboard data',
    })
  }
}

export default getDashBoard
