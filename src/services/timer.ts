import { Types } from 'mongoose'
import logger from '@utils/logger'
import { IQuiz, IParticipant, QuizCode } from 'types/quiz'
import isParticipant from '@utils/isParticipant'
import getQuiz from '@utils/getQuiz'
import QuizModel from '@models/quiz/quizModel'

const isQuizAcceptingAnswers = async (quizId: string) => {
  const quiz = await getQuiz(quizId)
  if (!quiz) {
    return false
  }
  if (!quiz.isPublished || !quiz.isAcceptingAnswers) {
    return false
  }
  return true
}

const isParticipantGivingQuiz = async (quizId: string, userId: string) => {
  const quiz = await getQuiz(quizId)
  const userObjectId = new Types.ObjectId(userId)
  const user = isParticipant(userObjectId, quiz?.participants)
  if (!user) {
    return true
  }

  if (user?.isGivingQuiz || user?.submitted) {
    return true
  }
  return false
}

async function checkUserQuizStatus(quizId: string, userId: string) {
  const isAcceptingAnswers: boolean = await isQuizAcceptingAnswers(quizId)
  const isGivingQuiz: boolean = await isParticipantGivingQuiz(quizId, userId)
  if (!isAcceptingAnswers || isGivingQuiz) {
    return false
  }
  return true
}

async function saveQuiz(quiz: IQuiz) {
  try {
    await QuizModel.findByIdAndUpdate(quiz._id, quiz)
  } catch (error) {
    logger.error(`Error updating quiz with quizId: ${quiz._id} : `, error)
  }
}

async function timerService(io: any, socket: any) {
  socket.on('join_quiz', async (data: any) => {
    socket.checkQuiz = QuizCode.JoinQuiz
    socket.quizId = data.quizId
    socket.userId = data.userId
    if (!socket.quizId || !socket.userId) {
      socket.disconnect()
    }

    const checkUserQuizStatusResult = await checkUserQuizStatus(socket.quizId, socket.userId)

    if (!checkUserQuizStatusResult) {
      socket.emit('sendTime', 0)
      socket.disconnect()
    } else {
      const quiz = await getQuiz(socket.quizId)
      if (!quiz) {
        socket.disconnect()
        return
      }
      const userObjectId = new Types.ObjectId(socket.userId)
      const user = isParticipant(userObjectId, quiz?.participants) as IParticipant
      if (!user) {
        socket.disconnect()
      }
      user.isGivingQuiz = true
      user.time.enterQuiz = new Date().getTime()
      user.time.endQuiz = (quiz?.quizMetadata?.endDateTimestamp as any).getTime()
      user.time.left = Math.min(user.time.left, user.time.endQuiz - new Date().getTime())
      saveQuiz(quiz)
      if (user.time.left <= 0) {
        socket.emit('sendTime', -1)
        socket.disconnect()
        return
      }
      socket.emit('sendTime', user.time.left)
    }
  })

  socket.on('disconnect', async (reason: string) => {
    if (socket.checkQuiz === QuizCode.JoinQuiz && reason != QuizCode.ServerDisconnect) {
      const quiz = await getQuiz(socket.quizId)
      if (!quiz) {
        return
      }
      const userObjectId = new Types.ObjectId(socket.userId)
      const user = isParticipant(userObjectId, quiz?.participants) as IParticipant
      socket.checkQuiz = QuizCode.LeftQuiz
      user.time.left = Math.min(
        user.time.left - (new Date().getTime() - user.time.enterQuiz),
        user.time.endQuiz - new Date().getTime(),
      )

      user.isGivingQuiz = false
      saveQuiz(quiz)
    }
  })

  socket.on('checkRejoin', async (data: any) => {
    socket.quizId = data.quizId
    socket.userId = data.userId
    const quiz = await getQuiz(socket.quizId)
    if (!quiz) {
      socket.disconnect()
    }
    const userObjectId = new Types.ObjectId(socket.userId)
    const user = isParticipant(userObjectId, quiz?.participants) as IParticipant
    if (!user) socket.disconnect()
    if (user.isGivingQuiz) {
      user.isGivingQuiz = false
      user.time.endQuiz = (quiz?.quizMetadata?.endDateTimestamp as any).getTime()
      user.time.left = Math.min(
        user.time.left - (new Date().getTime() - user.time.enterQuiz),
        user.time.endQuiz - new Date().getTime(),
      )
      if (quiz) saveQuiz(quiz)
    }
  })
}

export default timerService
