import './style.scss';
import { setQuizForm } from '../../redux/modules/admin';
import QuizService from '../../services/QuizService';

export default class Chip {
  constructor({ text, type, store }) {
    this.text = text;
    this.type = type;
    this.store = store;
    this.chip = document.createElement('button');
    this.handleClick = this.handleClick.bind(this);
    this.init();
  }

  init() {
    this.chip.classList.add('chip-btn');
    this.chip.onclick = this.handleClick;
  }

  handleClick() {
    if (this.type === 'admin') this.displayQuizForm();
  }

  displayQuizForm() {
    const { admin } = this.store.getState();
    const { quizzes } = admin;

    const newQuizId = Math.max(0, ...quizzes.map(({ id }) => id)) + 1;

    this.store.dispatch(
      setQuizForm({
        on: true,
        type: 'ADD',
        data: QuizService.generateQuiz(newQuizId),
      })
    );
  }

  render() {
    const { chip, text } = this;
    chip.textContent = text;

    return chip;
  }
}
