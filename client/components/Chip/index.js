import './style.scss';
import { setQuizForm } from '../../redux/actions';
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

  get elem() {
    return this.chip;
  }

  init() {
    this.chip.classList.add('chip-btn');
    this.chip.onclick = this.handleClick;

    this.render();
  }

  handleClick() {
    if (this.type === 'admin') this.addQuiz();
  }

  addQuiz() {
    const { quizzes } = this.store.getState();

    const newQuizId = Math.max(0, ...quizzes.map(({ id }) => id)) + 1;

    this.store.dispatch(setQuizForm({
      on: true,
      type: 'ADD',
      data: QuizService.generateQuiz(newQuizId)
    }));
  }

  render() {
    const { chip, text } = this;
    chip.textContent = text;
  }
}
