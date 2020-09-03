import './style.scss';
import { deleteSelectedQuizzes } from '../../redux/modules/admin';

export default class Summary {
  constructor({ store }) {
    this.store = store;
    this.state = {
      quizzes: null
    };
    this.summary = document.createElement('div');
    this.deleteQuizzes = this.deleteQuizzes.bind(this);
    this.update = this.update.bind(this);
    this.unsubscribe = null;
    this.init();
  }

  init() {
    const {
      summary,
      store,
      update,
      deleteQuizzes
    } = this;
    const { admin } = store.getState();
    const { quizzes } = admin;

    summary.classList.add('summary-container');
    summary.onclick = deleteQuizzes;

    this.setState({ quizzes });
    this.unsubscribe = store.subscribe(update);
    console.log('Summary subscribed');
  }

  setState(newState) {
    this.state = newState;
  }

  deleteQuizzes({ target }) {
    if (!target.matches('.delete-selected')) return;
    this.store.dispatch(deleteSelectedQuizzes());
  }

  update() {
    const { store, state } = this;
    const { admin, router } = store.getState();
    if (router.page !== 'admin') {
      console.log('Summary unsubscribed');
      this.unsubscribe();
      return;
    }

    const { quizzes } = admin;

    if (state.quizzes === quizzes) return;

    this.setState({ quizzes });
    this.render();
  }

  render() {
    const { quizzes } = this.state;

    let html = 0;
    let css = 0;
    let js = 0;
    let selectedCount = 0;
    const total = quizzes.length;

    quizzes.forEach(({ category, selected }) => {
      if (category === 'html') html += 1;
      else if (category === 'css') css += 1;
      else js += 1;

      if (selected) selectedCount += 1;
    });

    this.summary.innerHTML = `<dl class="summary">
      <div class="count">
        <dt>Total</dt>
        <dd>${total}</dd>
      </div>
      <div class="count">
        <dt>HTML</dt>
        <dd>${html}</dd>
      </div>
      <div class="count">
        <dt>CSS</dt>
        <dd>${css}</dd>
      </div>
      <div class="count">
        <dt>JS</dt>
        <dd>${js}</dd>
      </div>
      <div class="count">
        <dt>Selected</dt>
        <dd>${selectedCount}</dd>
      </div>
    </dl>
    <button
      class="delete-selected icon-trash-empty"
      aria-label="Delete Selected"
    >(${selectedCount})</button>`;

    return this.summary;
  }
}
