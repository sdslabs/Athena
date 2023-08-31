import QuizModel from '@models/quiz/quizModel'
import logger from '@utils/logger'

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

async function checkUserQuizStatus(quizId: unknown, userId: unknown) {
  const isAcceptingAnswers: unknown = await isQuizAcceptingAnswers(quizId)
  const isGivingQuiz: unknown = await isParticipantGivingQuiz(quizId, userId)
  if (!isAcceptingAnswers || !isGivingQuiz) {
    return false
  }
  return true
}

// io.on('connection', (socket) => async () => {
//   const { quizId, userId } = socket.handshake.query

//   if (!quizId || !userId) {
//     socket.disconnect()
//   }

//   // check if the quiz is accepting answers and participant is giving quiz
//   // if not, disconnect the socket
//   const isAcceptingAnswers = await isQuizAcceptingAnswers(quizId)
//   const isGivingQuiz = await isParticipantGivingQuiz(quizId, userId)

//   if (!isAcceptingAnswers || !isGivingQuiz) {
//     socket.disconnect()
//   }

//   // join the room
//   // @ts-ignore
//   socket.emit('message', 'Welcome to the server!');
//   socket.join(quizId)
//   const enterQuizTimeStamp = getCurrentTime()
//   const quiz = await QuizModel.findById(quizId)
//   const endQuizTimeStamp=quiz.quizMetadata.endDateTimestamp
//   let timeLeft:number

//   const user = quiz.participants?.findEach((participant) => {
//     if (participant.user === userId) {
//       return participant
//     }
//   })

//   timeLeft=user.time.left

//   //send timeLeft to frontend

//   socket.on('disconnect', () => {
//     // on disconnect
//     const timePassed = getCurrentTime() - enterQuizTimeStamp
//     const timeToEnd = endQuizTimeStamp - getCurrentTime()
//     timeLeft = Math.min(timeLeft-timePassed, timeToEnd)
//     if(timeLeft <= -1000) {
//         // -1000 is because of server delays and transmission delays
//         //manipulation by user
//         // submit
//         //update db
//         user.submitted=true
//         socket.disconnect()
//     } else {
//         //update db
//           user.time.left=timeLeft
//           user.isGivingQuiz=false;
//     }

//   })
// })

function getCurrentTime() {
  const currentTime = new Date()
  return currentTime
}

let timeLeft: number
timeLeft=40000

async function timerService(io, socket) {
  //frontend must emit join_quiz event with quizId and userId as data
  let enterQuizTimeStamp: unknown
  let exitQuizTimestamp: unknown
  let user: unknown


  socket.on('message', function (data) {
    // socket.emit('time', {'time':'696969'});
  });

  socket.on('another-message', function (data) {
    socket.emit('not-news', { hello: 'world' });
  });

  socket.on('join_quiz', (data) => {
    // socket.emit('time', {'time':'696969'});

    const { room, username } = data
    console.log(room)
    console.log(username)
    console.log(data);
    
    // if (!quizId || !userId) {
    //   logger.silly('⚡️[server]: UserId or QuizId is empty.')
    //   console.log('⚡️[server]: UserId or QuizId is empty.')
    //   socket.disconnect()
    // }
    // socket.emit('time', {'time':'696969'});

    // try {
    //   const checkUserQuizStatusResult = await checkUserQuizStatus(quizId, userId);
    //   console.log(checkUserQuizStatusResult);
    // } catch (error) {
    //   console.error('Error checking user quiz status:', error);
    // }
    // console.log(checkUserQuizStatus)
    // socket.join(quizId)
    enterQuizTimeStamp = getCurrentTime()
    // const quiz = await QuizModel.findById(quizId)
    // endQuizTimeStamp = quiz.quizMetadata.endDateTimestamp

    // user = quiz.participants?.findEach((participant) => {
    //   if (participant.user === userId) {
    //     return participant
    //   }
    // })

    // timeLeft = user.time.left
    
    socket.emit('sendTime', timeLeft)
    socket.emit('receive_message', {"message":"yo", "username":"Timer", __createdtime__:getCurrentTime})
    console.log("Time sent")
    //send timeLeft to frontend
  })

  // socket.on('disconnect', () => {
  //   const timePassed = getCurrentTime() - enterQuizTimeStamp
  //   const timeToEnd = endQuizTimeStamp - getCurrentTime()
  //   timeLeft = Math.min(timeLeft - timePassed, timeToEnd)
  //   if (timeLeft <= -1000) {
  //     // -1000 is because of server delays and transmission delays
  //     //manipulation by user
  //     // submit
  //     //update db
  //     user.submitted = true
  //     socket.disconnect()
  //   } else {
  //     //update db
  //     user.time.left = timeLeft
  //     user.isGivingQuiz = false
  //   }
  // })

  socket.on('stop_time', (data)=>{
    console.log("Time  stopped: " + data);
  })

  socket.on('disconnect', (data)=>{
    console.log("Socket Disconnected: " + data);
    exitQuizTimestamp=getCurrentTime()
    timeLeft=timeLeft-(exitQuizTimestamp-enterQuizTimeStamp)
  })
}

function Time(io, socket) {
  // socket.on('message', function (data) {
  //   socket.emit('time', {'time':'696969'});
  // });

  // socket.on('another-message', function (data) {
  //   socket.emit('not-news', { hello: 'world' });
  // });
}

export default timerService
