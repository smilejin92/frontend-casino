import './style.scss';
import { debounce } from 'lodash';
import { setQuizFormData } from '../../../redux/modules/admin';

export default class Question {
  constructor({ store }) {
    this.store = store;
    this.container = document.createElement('div');
    this.editQuestion = debounce(this.editQuestion.bind(this), 300);
    this.update = this.update.bind(this);
    this.unsubscribe = null;
    this.init();
  }

  init() {
    const { store, container, editQuestion, update } = this;

    container.classList.add('question-container');
    container.onkeyup = editQuestion;
    container.onpaste = editQuestion;

    this.unsubscribe = store.subscribe(update);
    console.log('Question subscribed');
  }

  update() {
    const { admin } = this.store.getState();
    const { quizForm } = admin;
    const { validating, on } = quizForm;
    if (validating) this.editQuestion.flush();
    if (!on) {
      console.log('Question unsubscribed');
      this.unsubscribe();
    }
  }

  editQuestion({ target, clipboardData }) {
    if (!target.matches('#question')) return;

    const question = clipboardData
      ? clipboardData.getData('text').trim()
      : target.value.trim();

    this.store.dispatch(setQuizFormData({ question }));
  }

  render() {
    const { admin } = this.store.getState();
    const { quizForm } = admin;
    const { id, question } = quizForm.data;

    this.container.innerHTML = `
      <label for="question">Q${id}) </label>
      <input id="question" type="text" value="${question}"/>`;

    return this.container;
  }
}
