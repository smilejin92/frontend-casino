import './styles/header.module.scss';
import { setModal } from '../redux/actions';
// import Modal from './Modal';
import Modal from './Modal/index';
import QuizService from '../services/QuizService';

export default class Header {
  constructor(store) {
    this.store = store;
    this.container = document.createElement('header');
    this.heading = document.createElement('h1');
    this.addQuizBtn = document.createElement('button');
    this.modal = new Modal(store);
    this.init();
  }

  init() {
    const {
      container,
      heading,
      addQuizBtn,
      // modal,
      addQuiz
    } = this;

    heading.classList.add('logo', 'neon');
    heading.innerHTML = '<a role="button">Frontend Casino</a>';

    addQuizBtn.classList.add('add-quiz-btn');
    addQuizBtn.textContent = 'Add Quiz';
    addQuizBtn.addEventListener('click', addQuiz.bind(this));

    container.classList.add('header');
    container.appendChild(heading);
    container.appendChild(addQuizBtn);
    // container.appendChild(modal.container);
  }

  addQuiz() {
    const { store } = this;
    const { quizzes } = store.getState();

    const newQuizId = Math.max(0, ...quizzes.map(({ id }) => id));

    store.dispatch(setModal({
      on: true,
      type: 'ADD',
      quiz: QuizService.generateQuiz(newQuizId)
    }));
  }
}
