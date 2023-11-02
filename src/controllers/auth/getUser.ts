import userModel from '@models/user/userModel'
import { verifyToken } from '@utils/token'
import { Request, Response } from 'express'
import { IUser, JwtPayload } from 'types'

const getUser = async (req: Request, res: Response) => {
  const token = req.cookies.jwt
  let user: JwtPayload
  if (token) {
    try {
      user = verifyToken(token) as JwtPayload
      const userId = user.userId
      const document: IUser = (await userModel.findById(userId)) as IUser
      if (document.onboardingComplete === true) {
        res.send({ user, onboarded: true })
      } else {
        res.send({ user, onboarded: false })
      }
    } catch (e) {
        console.error(e);
    }
  } else {
    res.send({ user: null, onboarded: false })
  }
}

export default getUser
