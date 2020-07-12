import '../styles/modal.module.scss';
import Question from './Question';
import Setting from './Setting';
import Content from './Content';
import Options from './Options';
import ButtonGroup from './ButtonGroup';

export default class Modal {
  constructor(store) {
    this.store = store;
    this.prevModal = store.getState().modal;
    this.container = document.createElement('div');
    this.form = document.createElement('form');
    this.fields = document.createElement('div');
    this.question = new Question(store, this.prevModal);
    this.setting = new Setting(store, this.prevModal);
    this.content = new Content(store, this.prevModal);
    this.options = new Options(store, this.prevModal);
    this.btnGroup = new ButtonGroup(this);

    this.update = this.update.bind(this);
    this.init();
  }

  init() {
    const {
      store,
      container,
      form,
      fields,
      question,
      setting,
      content,
      options,
      btnGroup,
      update
    } = this;

    // modal > form > fields
    container.classList.add('modal');
    form.classList.add('quiz-form');
    fields.classList.add('fields');
    container.appendChild(form);
    form.appendChild(fields);

    // fields > elements
    const fieldElements = [
      question,
      setting,
      content,
      options,
      btnGroup
    ];

    fieldElements.forEach(e => fields.appendChild(e.container));

    // subscribe redux store
    store.subscribe(update);
  }

  update() {
    const {
      store,
      prevModal,
      container,
      form
    } = this;

    // modal의 참조가 이전과 동일하면 종료
    const { modal } = store.getState();
    if (prevModal === modal) return;

    // modal 참조 업데이트
    this.prevModal = modal;

    const header = document.querySelector('header');

    // modal이 꺼지면 active 클래스 제거,
    // DOM에서 제거
    if (!modal.on) {
      form.onsubmit = null;
      header.removeChild(container);
      return;
    }

    // modal이 켜지면 active 클래스 추가,
    // DOM에서 추가
    form.onsubmit = e => e.preventDefault();
    header.appendChild(container);
  }
}
