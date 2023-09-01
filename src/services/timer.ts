import QuizModel from '@models/quiz/quizModel'
import logger from '@utils/logger'
import { IQuiz, IParticipant } from '@types/quiz'
enum QuizCode {
  JoinQuiz = "20Ctg1G5UymjK3SmAAAB",
  LeftQuiz = "JLf_vCCDmW_nFGTRAAAB",
}

const isQuizAcceptingAnswers = async (quizId: string) => {
  const quiz: IQuiz = await QuizModel.findById(quizId)
  if (!quiz || !quiz.isPublished || !quiz.isAcceptingAnswers) {
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
    if (participant.user.toString() === userId) {
      return participant
    }
  })

  let reason: string
  if (!user) {
    console.log("User doesn't exist")
    return false
  }
  if (!user.isGivingQuiz || user.submitted) {
    if (!user.isGivingQuiz) reason = 'User is not giving quiz'
    if (user.submitted) reason = 'User has submitted the quiz'
    console.log(reason)
    return false
  }
  return true
}

async function checkUserQuizStatus(quizId: unknown, userId: unknown) {
  const isAcceptingAnswers: unknown = await isQuizAcceptingAnswers(quizId)
  const isGivingQuiz: unknown = await isParticipantGivingQuiz(quizId, userId)
  console.log('isParticipantGivingQuiz: ' + isGivingQuiz)
  console.log('isQuizAcceptingAnswers: ' + isAcceptingAnswers)
  if (!isAcceptingAnswers || !isGivingQuiz) {
    return false
  }
  return true
}

function getCurrentTime() {
  const currentTime = new Date()
  return currentTime
}

async function timerService(io, socket) {
  let user: IParticipant
  let quiz: IQuiz

  socket.on('join_quiz', async (data) => {
    socket.checkQuizJoin = QuizCode.JoinQuiz
    const quizId = data.quizId
    const userId = data.userId

    if (!quizId || !userId) {
      logger.silly('⚡️[server]: UserId or QuizId is empty.')
      console.log('⚡️[server]: UserId or QuizId is empty.')
      socket.disconnect()
    }

    const checkUserQuizStatusResult = await checkUserQuizStatus(quizId, userId)
    console.log('checkUserQuizStatusResult: ' + checkUserQuizStatusResult)

    if (!checkUserQuizStatusResult) {
      console.log('Wrong quizId or userId')
      logger.silly('Wrong quizId or userId')
      socket.disconnect()
    } else {
      quiz = await QuizModel.findById(quizId)
      user = quiz.participants.find((participant) => {
        if (participant.user.toString() === userId) {
          return participant
        }
      })
      user.time.enterQuiz = new Date().getTime()
      user.time.endQuiz = new Date('2023-09-02').getTime()
      user.time.left = Math.min(user.time.left, user.time.endQuiz - getCurrentTime())

      if (user.time.left <= 0) {
        socket.disconnect()
      }
      socket.emit('sendTime', user.time.left)
    }
  })

  socket.on('disconnect', async (reason: string) => {
    console.log(`User Disconnnected: ${reason}, Timer Paused`)
    if (reason === 'server namespace disconnect') {
      console.log('Server-Side Disconnection')
    } else if (socket.checkQuizJoin === QuizCode.JoinQuiz) {
      socket.checkQuizJoin = QuizCode.LeftQuiz
      user.time.left = Math.min(
        user.time.left - (getCurrentTime() - user.time.enterQuiz),
        user.time.endQuiz - getCurrentTime(),
      )
      console.log('timeLeft: ' + user.time.left)

      if (user.time.left <= 0) {
        if (user.time.left < -10000) {
          //handle manipulation by user
        }
        user.submitted = true
        console.log('TimeOver! Quiz Submitted')
      }
      user.isGivingQuiz = true
      try {
        await quiz.save()
        console.log('Quiz updated!')
      } catch (error) {
        console.error('Error updating quiz: ', error)
      }

      console.log(`Time Left: ${user.time.left}`)
    } else {
      console.log('Quiz was never Joined')
    }
  })
}

export default timerService
