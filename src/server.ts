import express, { Express, Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'
import connectDB from '@db/connectDB'
import authRouter from '@routers/auth'
import createQuizRouter from '@routers/createQuiz'
import giveQuizRouter from '@routers/giveQuiz'
import checkQuizRouter from '@routers/checkQuiz'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import mongoSanitize from 'express-mongo-sanitize'
import logger from '@utils/logger'
import timerService from './services/timer'
import { createToken } from '@utils/token'
import { Types } from 'mongoose'
import { UserRoles } from 'types'
import createLog from '@controllers/createLog'
// Initialize server
dotenv.config()
connectDB()

const app: Express = express()
const port = process.env.PORT

// Middlewares
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());

//socket.io
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})
io.on('connection', (socket) => {
  logger.silly(`⚡️[server]: User connected with socketId: ${socket.id}`)
  timerService(io, socket)
})

// Middleware to access response body and log accordingly
app.use((req: Request, res: Response, next: NextFunction) => {
  // Override the res.send method to access the response
  const originalSend = res.send
  res.send = function (body) {
    // Access the response here
    if (res.statusCode === 401) {
      logger.warn(
        `Unauthorized Request: ${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}`,
      )
    } else if (res.statusCode === 500) {
      logger.error(
        `Internal Server Error: ${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}`,
      )
    } else if (res.statusCode === 400) {
      logger.debug(`Bad Request: ${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}`)
    }
    // Call the original send method to send the response to the user
    return originalSend.call(this, body)
  }
  next()
})

// Routers
app.use('/auth', authRouter)
app.use('/checkQuiz', checkQuizRouter)
app.use('/createQuiz', createQuizRouter)
app.use('/giveQuiz', giveQuizRouter)

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})
app.post('/log', createLog);

server.listen(port, () => {
  logger.silly(`⚡️[server]: Server is running at http://localhost:${port}`)
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
  const userId = new Types.ObjectId('6476ff541d60914819117366')
  const emailAdd = 'tanmaybajaj567@gmail.com'
  const role = UserRoles.admin
  const token = createToken({ userId, emailAdd, role })
  console.log(token)
})

export default app
