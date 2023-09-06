import { Request, Response, NextFunction } from 'express';
import { UserRoles } from 'types'
import sendUnauthorizedResponse from './unauthorisedResponse';
import getQuiz from './getQuiz';


const isQuizAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req.body;
  const { quizId } = req.params;
  const quiz = await getQuiz(quizId);
  if (user.role === UserRoles.superAdmin || user.userId === quiz?.admin.toString()) {
    return next();
  }
  return sendUnauthorizedResponse(res);
}

export default isQuizAdmin;