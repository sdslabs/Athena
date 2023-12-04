import mongoose from 'mongoose'
import QuizModel from '@models/quiz/quizModel'
import logger from '@utils/logger'
import { IQuiz, IParticipant, QuizCode } from 'types/quiz'

const isQuizAcceptingAnswers = async (quizId: string) => {
  const quiz: IQuiz = await QuizModel.findById(quizId)
  if (!quiz) {
    return false
  }
  if (!quiz.isPublished || !quiz.isAcceptingAnswers) {
    return false
  }
  return true
}

const isParticipantGivingQuiz = async (quizId: string, userId: string) => {
  const quiz: IQuiz = await QuizModel.findById(quizId)
  if (!quiz) {
    return true
  }
  const userObjectId = mongoose.Types.ObjectId(userId)
  const user: IParticipant = quiz.participants.find((participant) => {
    if (participant.user.equals(userObjectId)) {
      return participant
    }
  })

  if (!user) {
    return true
  }
  if (user.isGivingQuiz || user.submitted) {
    return true
  }
  return false
}

async function checkUserQuizStatus(quizId: string, userId: string) {
  const isAcceptingAnswers: bool = await isQuizAcceptingAnswers(quizId)
  const isGivingQuiz: bool = await isParticipantGivingQuiz(quizId, userId)
  if (!isAcceptingAnswers || isGivingQuiz) {

    return false
  }
  return true
}

async function saveQuiz(quiz: IQuiz) {
  try {
    await quiz.save()
  } catch (error) {
    logger.error(`Error updating quiz with quizId: ${quiz._id} : `, error)
  }
}

async function timerService(io, socket) {
  console.log(new Date()) 
  socket.on('join_quiz', async (data) => {
    console.log("join_quiz called")
    socket.checkQuiz = QuizCode.JoinQuiz
    socket.quizId = data.quizId
    socket.userId = data.userId
    if (!socket.quizId || !socket.userId) {
      console.log("quiz id not")
      socket.disconnect()
     
    }

    const checkUserQuizStatusResult = await checkUserQuizStatus(socket.quizId, socket.userId)

    if (!checkUserQuizStatusResult) {
      console.log("checkUserQuizStatusResult false")
      socket.disconnect()
    } else {
      const quiz: IQuiz = await QuizModel.findById(socket.quizId)
      const userObjectId = mongoose.Types.ObjectId(socket.userId)
      const user: IParticipant = quiz.participants.find((participant) => {
        if (participant.user.equals(userObjectId)) {
          return participant
        }
      })
      // user.isGivingQuiz = true
      user.time.enterQuiz = new Date().getTime()
      user.time.endQuiz = quiz.quizMetadata.endDateTimestamp.getTime()
      user.time.left = Math.min(user.time.left, user.time.endQuiz -19800000 - (new Date()).getTime())
      console.log(user.time.endQuiz - (new Date()).getTime())
      console.log(user.time.left)
      console.log(user.time.endQuiz)
      console.log((new Date()).getTime())

      if (user.time.left <= 0) {
        console.log("time problem")
        socket.disconnect()
      }
      saveQuiz(quiz)
      socket.emit('sendTime', user.time.left)
    }
  })

  socket.on('disconnect', async (reason: string) => {
    console.log("hello",reason);
    if (socket.checkQuiz === QuizCode.JoinQuiz && reason != QuizCode.ServerDisconnect) {
      const quiz: IQuiz = await QuizModel.findById(socket.quizId)
      const userObjectId = mongoose.Types.ObjectId(socket.userId)
      const user: IParticipant = quiz.participants.find((participant) => {
        if (participant.user.equals(userObjectId)) {
          return participant
        }
      })
      socket.checkQuiz = QuizCode.LeftQuiz
      user.time.left = Math.min(
        user.time.left - (new Date() + 19800000 - user.time.enterQuiz),
        user.time.endQuiz -19800000 - new Date(),
      )

      user.isGivingQuiz = false
      saveQuiz(quiz)
    }
  })
}

export default timerService