import { debounce } from 'lodash';
import { setQuizFormData } from '../../redux/actions';

export default class Question {
  constructor({ store }) {
    this.store = store;
    this.container = document.createElement('div');
    this.handleChange = debounce(this.handleChange.bind(this), 300);
    this.init();
  }

  get elem() {
    return this.container;
  }

  init() {
    const {
      container,
      handleChange
    } = this;

    container.classList.add('question-container');
    container.onkeyup = handleChange;
    container.onpaste = handleChange;

    this.render();
  }

  handleChange({ target, clipboardData }) {
    if (!target.matches('#question')) return;

    const question = clipboardData
      ? clipboardData.getData('text')
      : target.value;

    this.store.dispatch(setQuizFormData({
      question
    }));
  }

  render() {
    const { quizForm } = this.store.getState();
    const { id, question } = quizForm.data;

    this.container.innerHTML = `
      <label for="question">Q${id}) </label>
      <input id="question" type="text" value="${question}"/>`;
  }
}
