import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import { connectDB } from '@db/connectDB'
import quizRouter from '@routers/quiz'
import authRouter from '@routers/auth'
import sectionRouter from '@routers/section'
import cookieParser from 'cookie-parser'

// Initialize server
dotenv.config()
connectDB()

const app: Express = express()
const port = process.env.PORT

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// Routers
app.use('/quiz', quizRouter)
app.use('/auth', authRouter)
app.use('/section', sectionRouter)

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
