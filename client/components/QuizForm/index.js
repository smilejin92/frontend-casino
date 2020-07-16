import './style.scss';
import Question from './Question';
import Setting from './Setting';
import Content from './Content';
import Options from './Options';
// import ButtonGroup from './ButtonGroup';

export default class QuizForm {
  constructor({ store }) {
    this.store = store;
    this.state = {};
    this.container = document.createElement('div');
    this.form = document.createElement('form');
    this.update = this.update.bind(this);
    this.init();
  }

  get elem() {
    return this.container;
  }

  init() {
    const {
      container,
      form,
      store,
      update
    } = this;

    container.classList.add('quiz-form-container');
    form.classList.add('quiz-form');

    const { quizForm } = store.getState();
    // store.quizForm의 변화만을 추적하기 위함
    this.setState({
      on: quizForm.on,
      type: quizForm.type
    });

    store.subscribe(update);
  }

  setState(newState) {
    this.state = newState;
  }

  update() {
    const { state, store, container, form } = this;
    const { quizForm } = store.getState();

    if (state.on === quizForm.on && state.type === quizForm.type) return;

    const { type, on } = quizForm;

    this.setState({ on, type });

    // modal이 꺼지면 dom에서 제거
    if (!on) {
      container.classList.remove('active');
      form.onsubmit = null;
      form.innerHTML = '';
      container.innerHTML = '';
      return;
    }

    container.classList.add('active');
    form.onsubmit = e => e.preventDefault();
    this.render();
  }

  render() {
    const fieldset = document.createElement('div');
    fieldset.setAttribute('role', 'group');
    fieldset.classList.add('fields');

    const { store, form, container } = this;

    const children = [
      new Question({ store }),
      new Setting({ store }),
      new Content({ store }),
      new Options({ store }),
    ];

    children.forEach(child => fieldset.appendChild(child.elem));
    form.appendChild(fieldset);
    container.appendChild(form);
  }
}
