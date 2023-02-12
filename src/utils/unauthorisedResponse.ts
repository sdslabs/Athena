import { Response } from 'express'

const sendUnauthorizedResponse = (res: Response) => {
  res.status(401).json({ error: 'Unauthorized Request' })
}

export default sendUnauthorizedResponse
