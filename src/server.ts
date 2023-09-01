import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'
import { connectDB } from '@db/connectDB'
import staticRouter from '@routers/static'
import quizRouter from '@routers/quiz'
import authRouter from '@routers/auth'
import sectionRouter from '@routers/section'
import questionRouter from '@routers/question'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import mongoSanitize from 'express-mongo-sanitize'
import logger from '@utils/logger'
import timerService from './services/timer'
// Initialize server
dotenv.config()
connectDB()

const app: Express = express()
const port = process.env.PORT

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(morgan('dev'));
app.use(cors());

//socket.io
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})
io.on('connection', (socket) => {
  logger.silly(`⚡️[server]: User connected with socketId: ${socket.id}`)
  console.log(`⚡️[server]: User connected with socketId: ${socket.id}`)
  timerService(io, socket)
})


// Middleware to access response body and log accordingly
app.use((req, res, next) => {
  // Override the res.send method to access the response
  const originalSend = res.send;
  res.send = function (body) {
    // Access the response here
    if (res.statusCode === 401) {
      logger.warn(`Unauthorized Request: ${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}`,)
    } 
    else if (res.statusCode === 500) {
      logger.error(`Internal Server Error: ${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}`,)
    } 
    else if (res.statusCode === 400) {
      logger.debug(`Bad Request: ${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}`)
    }
    // Call the original send method to send the response to the user
    originalSend.call(this, body);
  };
  next();
});

// Routers
app.use('/static', staticRouter)
app.use('/quiz', quizRouter)
app.use('/auth', authRouter)
app.use('/section', sectionRouter)
app.use('/question', questionRouter)

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})

server.listen(port, () => {
  logger.silly(`⚡️[server]: Server is running at http://localhost:${port}`)
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})

export default app;