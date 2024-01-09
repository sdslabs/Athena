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
    if (participant.user && participant.user.equals(userObjectId)) {
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
  socket.on('join_quiz', async (data) => {
    socket.checkQuiz = QuizCode.JoinQuiz
    socket.quizId = data.quizId
    socket.userId = data.userId
    if (!socket.quizId || !socket.userId) {
      socket.disconnect()
    }

    const checkUserQuizStatusResult = await checkUserQuizStatus(socket.quizId, socket.userId)

    if (!checkUserQuizStatusResult) {
      socket.disconnect()
    } else {
      const quiz: IQuiz = await QuizModel.findById(socket.quizId)
      const userObjectId = mongoose.Types.ObjectId(socket.userId)
      const user: IParticipant = quiz.participants.find((participant) => {
        if (participant.user && participant.user.equals(userObjectId)) {
          return participant
        }
      })
      user.isGivingQuiz = true
      user.time.enterQuiz = new Date().getTime()
      user.time.endQuiz = quiz.quizMetadata.endDateTimestamp.getTime()
      user.time.left = Math.min(user.time.left, user.time.endQuiz - new Date())

      if (user.time.left <= 0) {
        socket.disconnect()
      }
      saveQuiz(quiz)
      socket.emit('sendTime', user.time.left)
    }
  })

  socket.on('disconnect', async (reason: string) => {
    if (socket.checkQuiz === QuizCode.JoinQuiz && reason != QuizCode.ServerDisconnect) {
      const quiz: IQuiz = await QuizModel.findById(socket.quizId)
      const userObjectId = mongoose.Types.ObjectId(socket.userId)
      const user: IParticipant = quiz.participants.find((participant) => {
        if (participant.user && participant.user.equals(userObjectId)) {
          return participant
        }
      })
      socket.checkQuiz = QuizCode.LeftQuiz
      user.time.left = Math.min(
        user.time.left - (new Date() - user.time.enterQuiz),
        user.time.endQuiz - new Date(),
      )

      user.isGivingQuiz = false
      saveQuiz(quiz)
    }
  })
}

export default timerService
