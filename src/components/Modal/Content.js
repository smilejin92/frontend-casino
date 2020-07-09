import { debounce } from 'lodash';

export default class Content {
  constructor(store, prevModal) {
    this.store = store;
    this.state = {};
    this.prevModal = prevModal;
    this.container = document.createElement('div');
    this.toggleContentType = this.toggleContentType.bind(this);
    this.editContent = debounce(this.editContent.bind(this), 300);
    this.update = this.update.bind(this);
    this.init();
  }

  init() {
    const {
      store,
      container,
      update
    } = this;

    container.classList.add('content-container');
    store.subscribe(update);
  }

  update() {
    const {
      store,
      prevModal,
      container,
      toggleContentType,
      editContent
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
      container.onchange = null;
      return;
    }

    // modal이 켜지면 이벤트 핸들러 등록
    container.onkeyup = editContent;
    container.onpaste = editContent;
    container.onchange = toggleContentType;

    // state를 default 상태로 설정 후 render
    const { hasCode, content } = modal.quiz;
    this.setState({ hasCode, content });
    this.render();
  }

  setState(newState) {
    this.state = newState;
  }

  toggleContentType({ target }) {
    if (target.value !== 'text' && target.value !== 'code') return;

    const prevType = document.querySelector('.content-type .active');
    const currentType = target.parentNode;
    if (prevType === currentType) return;

    prevType.classList.remove('active');
    currentType.classList.add('active');

    this.setState({
      ...this.state,
      hasCode: target.value === 'code'
    });
  }

  editContent({ target, clipboardData }) {
    const content = clipboardData
      ? clipboardData.getData('text')
      : target.value;

    this.setState({
      ...this.state,
      content
    });
  }

  render() {
    const { state, container } = this;
    const { hasCode, content } = state;

    container.innerHTML = `<ul class="content-type">
      <li class="type ${hasCode ? '' : 'active'}">
        <label for="text-type">text</label>
        <input
          id="text-type"
          type="radio"
          value="text"
          name="types" ${hasCode ? '' : 'checked'}
        />
      </li>
      <li class="type ${hasCode ? 'active' : ''}">
        <label for="code-type">code</label>
        <input
          id="code-type"
          type="radio"
          value="code"
          name="types" ${hasCode ? 'checked' : ''}
        />
      </li>
    </ul>
    <textarea class="content" value="${content}">${content}</textarea>`;
  }
}
