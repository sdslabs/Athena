import { Response, Request } from 'express'
import sendFailureResponse from '@utils/failureResponse'
import QuizModel from '@models/quiz/quizModel'
import { JwtPayload } from 'types'

interface getAllQuizzesRequest extends Request {
  body: {
    user: JwtPayload
  }
}

const getAllQuizzes = async (req: getAllQuizzesRequest, res: Response) => {
  const user = req.body.user
  try {
    const quizzes = await QuizModel.find({});
    // send the response back with only the id, description, name startDateTimestamp, endDateTimestamp, and isPublished, isAcceptingAnswers
    const quizDetails = quizzes.map((quiz) => {
      if (quiz?.isPublished){
        const userStatus = quiz?.participants?.find((participant) => {
          if(participant.user.toString() === user.userId){
            return {
              registered: true,
              submitted: participant.submitted,
            }
          }
          else{
            return {
              registered: false,
              submitted: false,
            }
          }
        })
        return {
          _id: quiz._id,
          name: quiz?.quizMetadata?.name,
          description: quiz?.quizMetadata?.description,
          instructions: quiz?.quizMetadata?.instructions,
          startDateTimestamp: quiz?.quizMetadata?.startDateTimestamp,
          endDateTimestamp: quiz?.quizMetadata?.endDateTimestamp,
          isPublished: quiz?.isPublished,
          isAcceptingAnswers: quiz?.isAcceptingAnswers,
          registrationMetadata: quiz?.registrationMetadata,
          registered: userStatus?.registered,
          submitted: userStatus?.submitted,
        }
      }
    })
    return res.status(200).send({ message: 'Quizzes fetched', quizzes: quizDetails })
  }
  catch (error: unknown) {
    sendFailureResponse({
      res,
      error,
      messageToSend: 'Failed to fetch quizzes',
    })
  }
}

export default getAllQuizzes