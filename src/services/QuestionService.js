const url = 'http://localhost:3000';

export default class QuestionService {
  static fetchQuestions() {
    return fetch(`${url}/questions`);
  }
}
