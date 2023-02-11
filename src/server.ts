import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import { connectDB } from '@db/connectDB'
import quizRouter from '@routers/quiz'

// Initialize server
dotenv.config()
connectDB()

const app: Express = express()
const port = process.env.PORT

// Middlewares
app.use(express.json())

// Routers
app.use('/quiz', quizRouter)

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
