import './style.scss';
import QuizService from '../../services/QuizService';
import { setModal } from '../../redux/actions';

// text와 handleClick 함수를 전달 받는다.
export default class Chip {
  constructor(props) {
    this.props = props;
    this.chip = document.createElement('button');
    this.handleClick = this.handleClick.bind(this);
    this.init();
  }

  get elem() {
    return this.chip;
  }

  init() {
    const { chip } = this;
    chip.classList.add('chip-btn');
    chip.onclick = this.handleClick;

    this.render();
  }

  handleClick() {
    const { type } = this.props;
    if (type === 'admin') this.addQuiz();
  }

  addQuiz() {
    console.log('addQuiz');
    // const { store } = this.props;
    // const { quizzes } = store.getState();

    // const newQuizId = Math.max(0, ...quizzes.map(({ id }) => id)) + 1;

    // store.dispatch(setModal({
    //   on: true,
    //   type: 'ADD',
    //   quiz: QuizService.generateQuiz(newQuizId)
    // }));
  }

  render() {
    const { chip, props } = this;
    chip.textContent = props.text;
  }
}
