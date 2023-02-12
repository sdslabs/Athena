import { Response } from 'express'

const sendInvalidInputResponse = (res: Response) => {
  res.status(400).json({ error: 'Invalid input' })
}

export default sendInvalidInputResponse
