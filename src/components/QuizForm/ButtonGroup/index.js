import './style.scss';
import { setQuizForm, postQuiz, editQuiz } from '../../../redux/modules/admin';

export default class ButtonGroup {
  constructor({ store }) {
    this.store = store;
    this.container = document.createElement('div');
    this.handleClick = this.handleClick.bind(this);
    this.init();
  }

  init() {
    const { container, handleClick } = this;
    container.classList.add('btn-group');
    container.onclick = handleClick;
  }

  handleClick({ target }) {
    if (target.matches('.add')) {
      this.submitQuiz();
      return;
    }

    if (target.matches('.cancel') || target.matches('.exit')) {
      this.exitModal();
    }
  }

  submitQuiz() {
    const { admin } = this.store.getState();
    const { quizForm } = admin;
    const { type, data } = quizForm;

    if (type === 'ADD') this.store.dispatch(postQuiz(data));
    if (type === 'EDIT') this.store.dispatch(editQuiz(data));
  }

  exitModal() {
    this.store.dispatch(setQuizForm({
      type: '',
      on: false,
      data: null,
    }));
  }

  render() {
    const { admin } = this.store.getState();
    const { quizForm } = admin;
    const { type } = quizForm;

    this.container.innerHTML = `<button class="modal-btn add icon-check">${type}</button>
    <button class="modal-btn cancel icon-cancel">CANCEL</button>
    <button class="exit icon-cancel" aria-label="exit"></button>`;

    return this.container;
  }
}
