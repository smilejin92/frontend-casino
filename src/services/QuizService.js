import he from 'he';

const url = 'http://localhost:5000/api/quizzes';

export default class QuizService {
  static request(method, resource, payload) {
    const _url = resource ? `${url}/${resource}` : url;

    return fetch(_url, {
      method,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
  }

  static fetchQuizzes(category) {
    return QuizService.request('GET', category);
  }

  static addQuiz(payload) {
    return QuizService.request('POST', null, payload);
  }

  static editQuiz(payload) {
    return QuizService.request('PUT', payload.id, payload);
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

  static generateQuiz(id) {
    return {
      id,
      question: '',
      category: 'html',
      point: 1000,
      second: 30,
      content: '',
      options: {
        a: '',
      },
      hasMultipleAnswers: false,
      answer: 'a',
      hasCode: false,
      selected: false,
    };
  }

  static validateInput(quiz) {
    const err = new Error();
    // err.type = 'validation';
    err.data = [];

    if (!quiz.question.trim()) {
      err.data.push({
        type: 'title',
        message: '제목을 입력해주세요.'
      });
      // err.message = '제목을 입력해주세요.';
      // throw err;
    }

    const optionHasValue = Object
      .keys(quiz.options)
      .every(k => quiz.options[k].trim());

    if (!optionHasValue) {
      err.data.push({
        type: 'options',
        message: '보기를 모두 입력해주세요.'
      });
      // err.message = '보기를 모두 입력해주세요.';
      // throw err;
    }

    if (quiz.hasMultipleAnswers && !quiz.answer.length) {
      err.data.push({
        type: 'answer',
        message: '정답을 체크해주세요.'
      });
      // err.message = '정답을 체크해주세요.';
      // throw err;
    }
    throw err;
  }

  static escapeHtml(quiz) {
    const escaped = { ...quiz };

    escaped.question = he.escape(escaped.question);

    if (!escaped.hasCode && escaped.content) {
      escaped.content = he.escape(escaped.content);
    }

    Object.keys(escaped.options).forEach(key => {
      escaped.options[key] = he.escape(escaped.options[key]);
    });

    return escaped;
  }
}
