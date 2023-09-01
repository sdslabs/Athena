import mongoose from 'mongoose'
import QuizModel from '@models/quiz/quizModel'
import logger from '@utils/logger'
import { IQuiz, IParticipant } from '@types/quiz'
enum QuizCode {
  JoinQuiz = 'joinQuiz',
  LeftQuiz = 'leftQuiz',
  ServerDisconnect = 'server namespace disconnect',
}

const isQuizAcceptingAnswers = async (quizId: string) => {
  const quiz: IQuiz = await QuizModel.findById(quizId)
  if (!quiz) {
    logger.silly("Quiz doesn't exist with QuizId: ", quizId)
    return false
  }
  if (!quiz.isPublished || !quiz.isAcceptingAnswers) {
    logger.silly('Quiz is not Published or is not Accepting Answers with QuizId: ', quizId)
    return false
  }
  return true
}

const isParticipantGivingQuiz = async (quizId: string, userId: string) => {
  const quiz: Iquiz = await QuizModel.findById(quizId)
  if (!quiz) {
    return false
  }
  const user: IParticipant = quiz.participants.find((participant) => {
    if (participant.user.equals(mongoose.Types.ObjectId(userId))) {
      return participant
    }
  })

  let reason: string
  if (!user) {
    logger.silly("User doesn't exist with userId: ", userId)
    return false
  }
  if (user.isGivingQuiz || user.submitted) {
    if (user.isGivingQuiz) reason = 'User is giving quiz in another portal'
    if (user.submitted) reason = 'User has submitted the quiz'
    logger.silly(reason)
    return false
  }
  return true
}

async function checkUserQuizStatus(quizId: unknown, userId: unknown) {
  const isAcceptingAnswers: unknown = await isQuizAcceptingAnswers(quizId)
  const isGivingQuiz: unknown = await isParticipantGivingQuiz(quizId, userId)
  if (!isAcceptingAnswers || !isGivingQuiz) {
    return false
  }
  return true
}

function getCurrentTime() {
  const currentTime = new Date()
  return currentTime
}

async function saveQuiz(quiz: IQuiz) {
  try {
    await quiz.save()
    logger.silly('Quiz updated! QuizId: ', quiz._id)
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
      logger.silly('⚡️[server]: UserId or QuizId is empty.')
      socket.disconnect()
    }

    const checkUserQuizStatusResult = await checkUserQuizStatus(socket.quizId, socket.userId)

    if (!checkUserQuizStatusResult) {
      logger.silly('Wrong quizId or userId')
      socket.disconnect()
    } else {
      const quiz: IQuiz = await QuizModel.findById(socket.quizId)
      const user: IParticipant = quiz.participants.find((participant) => {
        if (participant.user.equals(mongoose.Types.ObjectId(socket.userId))) {
          return participant
        }
      })
      user.isGivingQuiz = true
      user.time.enterQuiz = new Date().getTime()
      user.time.endQuiz = new Date('2023-09-02').getTime()
      user.time.left = Math.min(user.time.left, user.time.endQuiz - getCurrentTime())

      if (user.time.left <= 0) {
        socket.disconnect()
      }
      saveQuiz(quiz)
      socket.emit('sendTime', user.time.left)
    }
  })

  socket.on('disconnect', async (reason: string) => {
    if (reason === QuizCode.ServerDisconnect) {
      logger.silly(`Server-Side Disconnection`)
    } else if (socket.checkQuiz === QuizCode.JoinQuiz) {
      const quiz: IQuiz = await QuizModel.findById(socket.quizId)
      const user: IParticipant = quiz.participants.find((participant) => {
        if (participant.user.equals(mongoose.Types.ObjectId(socket.userId))) {
          return participant
        }
      })
      socket.checkQuiz = QuizCode.LeftQuiz
      user.time.left = Math.min(
        user.time.left - (getCurrentTime() - user.time.enterQuiz),
        user.time.endQuiz - getCurrentTime(),
      )

      if (user.time.left <= 0) {
        if (user.time.left < -10000) {
          //handle manipulation by user
        }
        user.submitted = true
      }
      user.isGivingQuiz = false
      saveQuiz(quiz)
      logger.silly(`Time Left: ${user.time.left}`)
    } else {
      logger.silly(`Quiz was never Joined`)
    }
  })
}

export default timerService
