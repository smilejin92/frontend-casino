import './style.scss';
import QuizService from '../../services/QuizService';
import { setModal } from '../../redux/actions';

export default class AdminHeader {
  constructor(store) {
    this.store = store;
    this.container = document.createElement('header');
    this.heading = document.createElement('h1');
    this.addQuizBtn = document.createElement('button');
    this.addQuiz = this.addQuiz.bind(this);
    this.init();
  }

  init() {
    const {
      container,
      heading,
      addQuizBtn,
      addQuiz
    } = this;

    heading.classList.add('logo', 'neon');
    heading.innerHTML = '<a role="button">Frontend Casino</a>';

    addQuizBtn.classList.add('add-quiz-btn');
    addQuizBtn.textContent = 'Add Quiz';
    addQuizBtn.onclick = addQuiz;

    container.classList.add('header');

    this.render();
  }

  addQuiz() {
    const { store } = this;
    const { quizzes } = store.getState();

    const newQuizId = Math.max(0, ...quizzes.map(({ id }) => id)) + 1;

    store.dispatch(setModal({
      on: true,
      type: 'ADD',
      quiz: QuizService.generateQuiz(newQuizId)
    }));
  }

  render() {
    const {
      container,
      heading,
      addQuizBtn
    } = this;

    container.appendChild(heading);
    container.appendChild(addQuizBtn);
  }
}
