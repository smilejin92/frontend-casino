import QuizService from '../../services/QuizService';
import { addQuiz, editQuiz, setError, setModal } from '../../redux/actions';

export default class ButtonGroup {
  constructor(Modal) {
    this.state = '';
    this.Modal = Modal;
    this.container = document.createElement('div');
    this.update = this.update.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.init();
  }

  init() {
    const {
      container,
      Modal,
      update
    } = this;

    container.classList.add('btn-group');
    Modal.store.subscribe(update);
  }

  update() {
    const {
      Modal,
      container,
      handleClick
    } = this;

    // modal의 참조가 이전과 동일하면 종료
    const { modal } = Modal.store.getState();
    if (Modal.prevModal === modal) return;

    // modal이 꺼지면 이벤트 핸들러 제거
    if (!modal.on) {
      container.onclick = null;
      return;
    }

    // modal이 켜지면 이벤트 핸들러 등록
    container.onclick = handleClick;

    // modal의 상태에 맞게 버튼 render
    this.setState(modal.type);
    this.render();
  }

  setState(newState) {
    this.state = newState;
  }

  async handleClick(e) {
    const { target } = e;
    if (target.matches('.add')) {
      e.preventDefault();
      await this.submitQuiz();
    } else if (target.matches('.cancel') || target.matches('.exit')) {
      e.preventDefault();
      this.exitModal();
    }
  }

  async submitQuiz() {
    const {
      question,
      setting,
      content,
      options,
      store
    } = this.Modal;

    let newQuiz = {
      ...question.state,
      ...setting.state,
      ...content.state,
      ...options.state
    };

    try {
      QuizService.validateInput(newQuiz);
      newQuiz = QuizService.escapeHtml(newQuiz);

      const res = this.state === 'ADD'
        ? await QuizService.addQuiz(newQuiz)
        : await QuizService.editQuiz(newQuiz);

      const addedQuiz = await res.json();
      store.dispatch(this.state === 'ADD' ? addQuiz(addedQuiz) : editQuiz(addedQuiz));
      this.exitModal();
    } catch (err) {
      store.dispatch(setError(err));
      console.error(err);
    }
  }

  exitModal() {
    const { store } = this.Modal;
    store.dispatch(setModal({
      type: '',
      on: false,
      id: null
    }));
  }

  render() {
    const { container, state } = this;
    container.innerHTML = `<button class="modal-btn add">${state}</button>
    <button class="modal-btn cancel">CANCEL</button>
    <button class="exit">X</button>`;
  }
}
