import './style.scss';
import Fields from './Fields';
import Question from './Question';
import QuizSetting from './QuizSetting';
import Content from './Content';
import Options from './Options';
import ButtonGroup from './ButtonGroup';
import ErrorList from './ErrorList';

export default class QuizForm {
  constructor({ store }) {
    this.state = {};
    this.store = store;
    this.container = document.createElement('div');
    this.form = document.createElement('form');
    this.update = this.update.bind(this);

    this.init();
  }

  init() {
    const { container, form, update } = this;

    container.classList.add('quiz-form-container');
    form.classList.add('quiz-form');
    form.setAttribute('autocomplete', 'off');

    const { admin } = this.store.getState();
    const { quizForm } = admin;
    const { on, type } = quizForm;

    this.setState({ on, type });

    this.unsubscribe = this.store.subscribe(update);
    console.log('QuizForm subscribed');
  }

  setState(newState) {
    this.state = newState;
  }

  update() {
    const { state, container, form } = this;
    const { admin, router } = this.store.getState();
    if (router.page !== 'admin') {
      console.log('QuizForm unsubscribed');
      this.unsubscribe();
      return;
    }

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
    const { admin } = this.store.getState();
    const { quizForm } = admin;
    if (!quizForm.on) return this.container;

    const { form, container, store } = this;

    form.appendChild(
      new Fields({
        children: [
          new Question({ store }),
          new QuizSetting({
            store,
            categories: ['html', 'css', 'javascript'],
            points: [1000, 2500, 5000, 10000],
            seconds: [30, 45, 60, 90]
          }),
          new Content({ store }),
          new Options({ store }),
          new ButtonGroup({ store }),
          new ErrorList({ store })
        ],
      }).render()
    );

    container.appendChild(form);
    return this.container;
  }
}
