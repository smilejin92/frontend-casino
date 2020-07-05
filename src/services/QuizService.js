const url = 'http://localhost:3000/quizzes';

export default class QuizService {
  static request(method, resource, payload) {
    const _url = resource ? `${url}/${resource}` : url;

    return fetch(_url, {
      method,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  static fetchQuizzes(category) {
    return QuizService.request('GET', category);
  }

  static addQuiz(payload) {
    return QuizService.request('POST', null, payload);
  }

  static editQuiz(id, payload) {
    return QuizService.request('PUT', id, payload);
  }

  static removeQuiz(id) {
    return QuizService.request('DELETE', id);
  }

  static selectQuiz(id, payload) {
    return QuizService.request('PATCH', id, payload);
  }

  static removeSelectedQuizzes() {
    return QuizService.request('DELETE', 'selected');
  }
}
