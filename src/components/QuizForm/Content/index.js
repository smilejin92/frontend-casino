import './style.scss';
import { debounce } from 'lodash';
import { setQuizFormData } from '../../../redux/modules/admin';

export default class Content {
  constructor({ store }) {
    this.store = store;
    this.container = document.createElement('div');
    this.toggleContentType = this.toggleContentType.bind(this);
    this.editContent = debounce(this.editContent.bind(this), 300);
    this.update = this.update.bind(this);
    this.unsubscribe = null;
    this.init();
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

    this.unsubscribe = store.subscribe(update);
    console.log('Content subscribed');
  }

  update() {
    const { admin } = this.store.getState();
    const { quizForm } = admin;
    const { validating, on } = quizForm;
    if (validating) this.editContent.flush();
    if (!on) {
      console.log('Content unsubscribed');
      this.unsubscribe();
    }
  }

  toggleContentType({ target }) {
    const { value, parentNode } = target;

    if (value !== 'text' && value !== 'code') return;

    const prevType = document.querySelector('.content-type .active');
    const currentType = parentNode;
    if (prevType === currentType) return;

    prevType.classList.remove('active');
    currentType.classList.add('active');

    this.store.dispatch(setQuizFormData({
      hasCode: value === 'code'
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
    const { admin } = store.getState();
    const { quizForm } = admin;
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
    <textarea class="content">${content}</textarea>`;

    return container;
  }
}
