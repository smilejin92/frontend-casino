const url = 'http://localhost:3000';

export default class QuizService {
  static fetchQuizzes() {
    return fetch(`${url}/quizzes`);
  }
}
