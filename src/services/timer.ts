import app from 'server'
import { Server } from 'socket.io'
import QuizModel from '@models/quiz/quizModel'
import http from 'http'

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

const isQuizAcceptingAnswers = async (quizId: any) => {
  // get quiz from quizId
  const quiz = await QuizModel.findById(quizId)
  if (!quiz || !quiz.isPublished || !quiz.isAcceptingAnswers) {
    return false
  }
  return true
}

const isParticipantGivingQuiz = async (quizId: any, userId: any) => {
  // get quiz from quizId
  const quiz = await QuizModel.findById(quizId)
  if (!quiz) {
    return false
  }
  // @ts-ignore
  const user = quiz.participants?.findEach((participant) => {
    if (participant.user === userId) {
      return participant
    }
  })

  if (!user || !user.isGivingQuiz || user.submitted) {
    return false
  }
  return true
}

io.on('connection', (socket) => async () => {
  const { quizId, userId } = socket.handshake.query

  if (!quizId || !userId) {
    socket.disconnect()
  }

  // check if the quiz is accepting answers and participant is giving quiz
  // if not, disconnect the socket
  const isAcceptingAnswers = await isQuizAcceptingAnswers(quizId)
  const isGivingQuiz = await isParticipantGivingQuiz(quizId, userId)

  if (!isAcceptingAnswers || !isGivingQuiz) {
    socket.disconnect()
  }

  // join the room
  // @ts-ignore
  socket.emit('message', 'Welcome to the server!');
  socket.join(quizId)
  const enterQuizTimeStamp = getCurrentTime()
  const quiz = await QuizModel.findById(quizId)
  const endQuizTimeStamp=quiz.quizMetadata.endDateTimestamp
  let timeLeft:number
  
  
  const user = quiz.participants?.findEach((participant) => {
    if (participant.user === userId) {
      return participant
    }
  })

  timeLeft=user.time.left

  //send timeLeft to frontend

  socket.on('disconnect', () => {
    // on disconnect
    const timePassed = getCurrentTime() - enterQuizTimeStamp
    const timeToEnd = endQuizTimeStamp - getCurrentTime()
    timeLeft = Math.min(timeLeft-timePassed, timeToEnd) 
    if(timeLeft <= -1000) {
        // -1000 is because of server delays and transmission delays
        //manipulation by user
        // submit
        //update db
        user.submitted=true
        socket.disconnect()
    } else {
        //update db
          user.time.left=timeLeft
          user.isGivingQuiz=false;
    }   
    
  })
})

function getCurrentTime(){
    const currentTime = new Date()
    return currentTime
  }