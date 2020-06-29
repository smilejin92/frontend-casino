import './styles/questions.module.scss';
import Quiz from './Quiz';
import QuizServices from '../services/QuizServices';
import { fetchQuizzes, setError } from '../redux/actions';

export default class Quizzes {
  constructor(store) {
    this.store = store;
    this.tab = '';
    this.container = document.createElement('ul');
    this.init();
  }

  async init() {
    const { container, store, handleTab } = this;
    container.classList.add('questions');

    store.subscribe(handleTab.bind(this));

    try {
      const res = await QuizServices.fetchQuizzes();
      const quizzes = await res.json();
      store.dispatch(fetchQuizzes(quizzes));
    } catch (err) {
      store.dispatch(setError(err));
      console.error(err);
    }
  }

  handleTab() {
    const { tab, store } = this;
    const { tab: _tab } = store.getState();
    if (tab === _tab) return;

    this.render();
    this.tab = _tab;
  }

  render() {
    const { container, store } = this;
    const { quizzes, tab } = store.getState();
    const _quizzes = tab === 'all'
      ? quizzes
      : quizzes.filter(q => q.category === tab);

    let quizItems = '';
    _quizzes.forEach(q => {
      quizItems += Quiz(q);
    });

    container.innerHTML = quizItems;
  }
}
