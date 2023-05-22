import express, { Express, NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import { connectDB } from '@db/connectDB'
import quizRouter from '@routers/quiz'
import authRouter from '@routers/auth'
import sectionRouter from '@routers/section'
import questionRouter from '@routers/question'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import mongoSanitize from 'express-mongo-sanitize'
import logger from '@utils/logger'

// Initialize server
dotenv.config()
connectDB()

const app: Express = express()
const port = process.env.PORT

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(mongoSanitize());
app.use(morgan('dev'));
app.use((req: Request, res: Response, next: NextFunction) => {
  if(res.statusCode === 200) {
  logger.info(`${req.method} ${req.url}`)
  }
  next()
})


//cors handling to be done

// Routers
app.use('/quiz', quizRouter)
app.use('/auth', authRouter)
app.use('/section', sectionRouter)
app.use('/question', questionRouter)

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
