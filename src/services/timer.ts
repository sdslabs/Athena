import QuizModel from '@models/quiz/quizModel'
import logger from '@utils/logger'
import { IQuiz, IParticipant, IParticipantTime } from '@types/quiz'

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
  if (!user || !user.isGivingQuiz || user.submitted) {
    if (!user) reason = "User doesn't exist"
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
  const participantTime: IParticipantTime = {
    left: 0,
    toEnd: 0,
    passed: 0,
    enterQuiz: 0,
    exitQuiz: 0,
    endQuiz: 0,
  }
  let user: IParticipant
  let quiz: IQuiz

  socket.on('join_quiz', async (data) => {
    socket.checkQuizJoin = 'QuizJoined'
    console.log(socket.checkQuizJoin)
    participantTime.enterQuiz = new Date().getTime()
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
      // participantTime.endQuiz = quiz.quizMetadata.endDateTimestamp.getTime()
      participantTime.endQuiz = new Date('2023-09-02').getTime()
      user = quiz.participants.find((participant) => {
        if (participant.user.toString() === userId) {
          return participant
        }
      })
      participantTime.toEnd = participantTime.endQuiz - getCurrentTime()
      participantTime.left = Math.min(user.time.left, participantTime.toEnd)

      if (participantTime.left <= 0) {
        console
        socket.disconnect()
      }
      socket.emit('sendTime', participantTime.left)
    }
  })

  socket.on('disconnect', async (reason: string) => {
    console.log(`User Disconnnected: ${reason}, Timer Paused`)
    if (reason === 'server namespace disconnect') {
      console.log('Server-Side Disconnection')
    } else if (socket.checkQuizJoin === 'QuizJoined') {
      socket.checkQuizJoin = 'QuizLeft'
      participantTime.exitQuiz = getCurrentTime()
      participantTime.passed = participantTime.exitQuiz - participantTime.enterQuiz
      participantTime.toEnd = participantTime.endQuiz - participantTime.exitQuiz
      participantTime.left = Math.min(
        participantTime.left - participantTime.passed,
        participantTime.toEnd,
      )
      console.log('timeLeft: ' + participantTime.left)

      if (participantTime.left <= 0) {
        if (participantTime.left < -10000) {
          //handle manipulation by user
        }
        user.submitted = true
        console.log('TimeOver! Quiz Submitted')
      }
      user.isGivingQuiz = true
      user.time.left = participantTime.left
      try {
        await quiz.save()
        console.log('Quiz updated!')
      } catch (error) {
        console.error('Error updating quiz: ', error)
      }

      console.log(`Time Left: ${participantTime.left}`)
    } else {
      console.log('Quiz was never Joined')
    }
  })
}

export default timerService
