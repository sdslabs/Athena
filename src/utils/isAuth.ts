import { verifyToken } from '@utils/token'
import { Request, Response, NextFunction } from 'express'
import sendUnauthorizedResponse from '@utils/unauthorisedResponse'

const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt
  if (!token) {
    return sendUnauthorizedResponse(res)
  }
  try {
    const user = verifyToken(token)
    req.body.user = user
    next()
  } catch (error) {
    return sendUnauthorizedResponse(res)
  }
}

export default isAuth
