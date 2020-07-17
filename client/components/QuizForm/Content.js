import { debounce } from 'lodash';
import { setQuizFormData } from '../../redux/actions';

export default class Content {
  constructor({ store }) {
    this.store = store;
    this.container = document.createElement('div');
    this.toggleContentType = this.toggleContentType.bind(this);
    this.editContent = debounce(this.editContent.bind(this), 200);
    this.update = this.update.bind(this);
    this.init();
  }

  get elem() {
    return this.container;
  }

  init() {
    const {
      store,
      container,
      editContent,
      toggleContentType,
      update
    } = this;

    container.classList.add('content-container');
    container.onkeyup = editContent;
    container.onpaste = editContent;
    container.onchange = toggleContentType;

    store.subscribe(update);

    this.render();
  }

  update() {
    const { quizForm } = this.store.getState();
    const { validating } = quizForm;
    if (validating) this.editContent.flush();
  }

  toggleContentType({ target }) {
    if (target.value !== 'text' && target.value !== 'code') return;

    const prevType = document.querySelector('.content-type .active');
    const currentType = target.parentNode;
    if (prevType === currentType) return;

    prevType.classList.remove('active');
    currentType.classList.add('active');

    this.store.dispatch(setQuizFormData({
      hasCode: target.value === 'code'
    }));
  }

  editContent({ target, clipboardData }) {
    const content = clipboardData
      ? clipboardData.getData('text')
      : target.value;

    this.store.dispatch(setQuizFormData({ content }));
  }

  render() {
    const { store, container } = this;
    const { quizForm } = store.getState();
    const { hasCode, content } = quizForm.data;

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
