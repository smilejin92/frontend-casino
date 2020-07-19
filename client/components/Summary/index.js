import './style.scss';
import QuizService from '../../services/QuizService';
import { removeSelectedQuizzes, setError } from '../../redux/actions';

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
    const { quizzes } = store.getState();

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

      const categoryList = document.querySelector('.categories');
      categoryList.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      this.store.dispatch(setError(err));
      console.error(err);
    }
  }

  update() {
    const { store, state } = this;
    const { quizzes } = store.getState();

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

    this.summary.innerHTML = `<dl>
      <dt>Total</dt>
      <dd>${total}</dd>
      <dt>HTML</dt>
      <dd>${html}</dd>
      <dt>CSS</dt>
      <dd>${css}</dd>
      <dt>JavaScript</dt>
      <dd>${js}</dd>
      <dt>Selected</dt>
      <dd>${selectedCount}</dd>
    </dl>
    <button class="delete-selected">Delete Selected</button>`;
  }
}
