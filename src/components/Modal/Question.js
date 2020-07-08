import { debounce } from 'lodash';

export default class Question {
  constructor(store, prevModal) {
    this.store = store;
    this.state = {};
    this.prevModal = prevModal;
    this.container = document.createElement('div');
    this.handleChange = this.handleChange.bind(this);
    this.update = this.update.bind(this);
    this.init();
  }

  init() {
    const {
      store,
      container,
      update
    } = this;

    container.classList.add('question-container');
    store.subscribe(update);
  }

  update() {
    const {
      store,
      prevModal,
      container,
      handleChange
    } = this;

    // modal의 참조가 이전과 동일하면 종료
    const { modal } = store.getState();
    if (prevModal === modal) return;

    // modal 참조 업데이트
    this.prevModal = modal;

    // modal이 꺼지면 이벤트 핸들러 제거
    if (!modal.on) {
      container.onkeyup = null;
      container.onpaste = null;
      return;
    }

    // modal이 켜지면 이벤트 핸들러 등록
    container.onkeyup = debounce(handleChange, 300);
    container.onpaste = handleChange;

    // state를 default 상태로 설정 후 render
    const { id, question, selected } = modal.quiz;
    this.setState({ id, question, selected });
    this.render();
  }

  setState(newState) {
    this.state = newState;
  }

  handleChange({ target, clipboardData }) {
    if (!target.matches('#question')) return;

    const question = clipboardData
      ? clipboardData.getData('text')
      : target.value;

    this.setState({
      ...this.state,
      question
    });
  }

  render() {
    const { state, container } = this;
    const { id, question } = state;

    container.innerHTML = `
      <label for="question">Q${id}) </label>
      <input id="question" type="text" value="${question}"/>`;
  }
}
