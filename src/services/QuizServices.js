const url = 'http://localhost:3000/quizzes';

export default class QuizService {
  static fetchQuizzes() {
    return fetch(`${url}`);
  }

  static addQuiz(payload) {
    return fetch(`${url}`, {
      method: 'POST',
      headers: { 'content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  static editQuiz(id, payload) {
    return fetch(`${url}/${id}`, {
      method: 'PUT',
      headers: { 'content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  static removeQuiz(id) {
    return fetch(`${url}/${id}`, {
      method: 'DELETE',
    });
  }

  static selectQuiz(id, payload) {
    return fetch(`${url}/${id}`, {
      method: 'PATCH',
      headers: { 'content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  static removeSelectedQuizzes() {
    return fetch(`${url}/selected`, {
      method: 'DELETE'
    });
  }
}
