import './style.scss';
import QuizService from '../../services/QuizService';
import { removeSelectedQuizzes, setError } from '../../redux/modules/admin';

export default class Summary {
  constructor({ store }) {
    this.store = store;
    this.state = {};
    this.summary = document.createElement('div');
    this.deleteSelectedQuizzes = this.deleteSelectedQuizzes.bind(this);
    this.update = this.update.bind(this);
    this.init();
  }

  get elem() {
    return this.summary;
  }

  init() {
    const {
      summary,
      store,
      update,
      deleteSelectedQuizzes
    } = this;
    const { admin } = store.getState();
    const { quizzes } = admin;

    summary.classList.add('summary-container');
    summary.onclick = deleteSelectedQuizzes;

    this.setState({ quizzes });
    this.render();

    store.subscribe(update);
  }

  setState(newState) {
    this.state = newState;
  }

  async deleteSelectedQuizzes({ target }) {
    if (!target.matches('.delete-selected')) return;

    try {
      const res = await QuizService.removeSelectedQuizzes();
      const filteredQuizzes = await res.json();
      this.store.dispatch(removeSelectedQuizzes(filteredQuizzes));
    } catch (err) {
      this.store.dispatch(setError(err));
      console.error(err);
    }
  }

  update() {
    const { store, state } = this;
    const { admin } = store.getState();
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
  }
}
