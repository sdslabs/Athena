import QuizModel from '@models/quiz/quizModel'

const getQuiz = (quizId: string) => {
  return QuizModel.findById(quizId);
}

export default getQuiz