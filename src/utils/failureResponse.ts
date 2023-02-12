import { Response } from 'express'

interface sendFailureResponseOptions {
  res: Response
  error: unknown
  messageToSend: string
  errorCode?: number
}

const sendFailureResponse = ({
  res,
  error,
  messageToSend,
  errorCode = 500,
}: sendFailureResponseOptions) => {
  console.log(`🔴 ${messageToSend}: ${error}`)
  res.status(errorCode).json({
    error: messageToSend,
  })
}

export default sendFailureResponse
