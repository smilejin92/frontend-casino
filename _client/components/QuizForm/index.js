import './style.scss';
import Fields from './Fields';
import Question from './Question';
import Setting from './Setting';
import Content from './Content';
import Options from './Options';
import ButtonGroup from './ButtonGroup';

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

    const { admin } = store.getState();
    const { quizForm } = admin;
    const { on, type } = quizForm;

    this.setState({ on, type });

    store.subscribe(update);
  }

  setState(newState) {
    this.state = newState;
  }

  update() {
    const {
      state,
      store,
      container,
      form
    } = this;
    const { admin } = store.getState();
    const { quizForm } = admin;

    if (state.on === quizForm.on && state.type === quizForm.type) return;

    const { type, on } = quizForm;
    this.setState({ on, type });

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
    const {
      store,
      form,
      container
    } = this;

    form.appendChild(
      new Fields({
        children: [
          new Question({ store }),
          new Setting({
            store,
            categories: ['html', 'css', 'javascript'],
            points: [1000, 2500, 5000, 10000],
            seconds: [30, 45, 60, 90]
          }),
          new Content({ store }),
          new Options({ store }),
          new ButtonGroup({ store })
        ]
      }).elem
    );

    container.appendChild(form);
  }
}
