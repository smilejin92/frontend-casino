import './style.scss';
import { setQuizForm } from '../../redux/modules/admin';
import QuizService from '../../services/QuizService';
import { getStore } from '../../redux/store';

function addQuiz() {
  const store = getStore();
  const { admin } = store.getState();
  const { quizzes } = admin;

  const newQuizId = Math.max(0, ...quizzes.map(({ id }) => id)) + 1;

  store.dispatch(
    setQuizForm({
      on: true,
      type: 'ADD',
      data: QuizService.generateQuiz(newQuizId),
    })
  );
}

export default class Chip {
  constructor({ text, type }) {
    this.text = text;
    this.type = type;
    this.chip = document.createElement('button');
    this.handleClick = this.handleClick.bind(this);
    this.init();
  }

  init() {
    this.chip.classList.add('chip-btn');
    this.chip.onclick = this.handleClick;
  }

  handleClick() {
    if (this.type === 'admin') addQuiz();
  }

  render() {
    const { chip, text } = this;
    chip.textContent = text;

    return chip;
  }
}
