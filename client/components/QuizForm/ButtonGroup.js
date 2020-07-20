import QuizService from '../../services/QuizService';
import { addQuiz, editQuiz, setError, setQuizForm } from '../../redux/modules/admin';

export default class ButtonGroup {
  constructor({ store }) {
    this.store = store;
    this.container = document.createElement('div');
    this.handleClick = this.handleClick.bind(this);
    this.init();
  }

  get elem() {
    return this.container;
  }

  init() {
    const { container, handleClick } = this;
    container.classList.add('btn-group');
    container.onclick = handleClick;
    this.render();
  }

  async handleClick(e) {
    const { target } = e;
    if (target.matches('.add')) {
      await this.submitQuiz();
      return;
    }

    if (target.matches('.cancel') || target.matches('.exit')) {
      this.exitModal();
    }
  }

  async submitQuiz() {
    this.store.dispatch(setQuizForm({ validating: true }));

    try {
      const { admin } = this.store.getState();
      const { quizForm } = admin;
      const { type } = quizForm;
      let { data } = quizForm;

      QuizService.validateInput(data);
      data = QuizService.escapeHtml(data);

      const res = type === 'ADD'
        ? await QuizService.addQuiz(data)
        : await QuizService.editQuiz(data);

      const addedQuiz = await res.json();

      this.exitModal();
      this.store.dispatch(type === 'ADD'
        ? addQuiz(addedQuiz)
        : editQuiz(addedQuiz));

      const position = document.getElementById(addedQuiz.id);
      position.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
      this.store.dispatch(setError(err));
      console.error(err);
    }
  }

  exitModal() {
    this.store.dispatch(setQuizForm({
      type: '',
      on: false,
      validating: false,
      data: null,
    }));
  }

  render() {
    const { admin } = this.store.getState();
    const { quizForm } = admin;
    const { type } = quizForm;

    this.container.innerHTML = `<button class="modal-btn add">${type}</button>
    <button class="modal-btn cancel">CANCEL</button>
    <button class="exit">X</button>`;
  }
}
