import app from "server";
import { Server } from "socket.io";
import QuizModel from "@models/quiz/quizModel"
import http from 'http';

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});


const isQuizAcceptingAnswers = async (quizId: any) => {
    // get quiz from quizId
    const quiz = await QuizModel.findById(quizId);
    if(!quiz || !quiz.isPublished || !quiz.isAcceptingAnswers) {
        return false;
    }
    return true;
}

const isParticipantGivingQuiz = async (quizId: any, userId: any) => {
    // get quiz from quizId
    const quiz = await QuizModel.findById(quizId);
    if(!quiz) {
        return false;
    }
    // @ts-ignore
    const user = quiz.participants?.findEach((participant) => {
        if(participant.user === userId) {
            return participant;
        }
    })

    if(!user || !user.isGivingQuiz) {
        return false;
    }
    return true;
}


io.on('connection', (socket) =>  async () =>{
    
    const { quizId, userId } = socket.handshake.query;

    if(!quizId || !userId) {
        socket.disconnect();
    }

    // check if the quiz is accepting answers and participant is giving quiz
    // if not, disconnect the socket
    const isAcceptingAnswers = await isQuizAcceptingAnswers(quizId);
    const isGivingQuiz = await isParticipantGivingQuiz(quizId, userId);

    if(!isAcceptingAnswers || !isGivingQuiz) {
        socket.disconnect();
    }

    // join the room
    // @ts-ignore
    socket.join(quizId);

    socket.on('disconnect', () => {
        // on disconnect
        /*
            const timePassed = Date.now() - startTime;
            const timeLeft = leftTime - timePassed;
            if(timeLeft <= 0) {
                // submit the quiz
                disconnect the socket
            } else {
                // update the time left
                disconnect the socket
            }
        */
    }) 
})