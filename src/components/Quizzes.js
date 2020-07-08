import './styles/quizzes.module.scss';
import Quiz from './Quiz';
import QuizService from '../services/QuizService';
import { fetchQuizzes, setError, setModal, removeQuiz, selectQuiz, removeSelectedQuizzes } from '../redux/actions';

export default class Quizzes {
  constructor(store) {
    this.store = store;
    this.state = {};
    this.container = document.createElement('div');
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.update = this.update.bind(this);
    this.init();
  }

  async init() {
    const {
      container,
      store,
      handleClick,
      handleChange,
      update
    } = this;

    container.classList.add('quizzes-container');
    container.onclick = handleClick;
    container.onchange = handleChange;

    // 상태 초기화
    const { quizzes, tab } = store.getState();
    this.setState({ quizzes, tab });

    // subscribe redux store
    store.subscribe(update);

    try {
      // fetch quizzes
      const res = await QuizService.fetchQuizzes();
      const _quizzes = await res.json();

      // update redux store
      store.dispatch(fetchQuizzes(_quizzes.sort((a, b) => b.id - a.id)));
    } catch (err) {
      store.dispatch(setError(err));
      console.error(err);
    }
  }

  update() {
    const { store, state } = this;

    // 이전 상태와 동일하면 return
    const { tab, quizzes, modal } = store.getState();
    if (state.tab === tab && state.quizzes === quizzes) return;

    // 상태 최신화
    this.setState({ tab, quizzes });

    // active selected tab
    const tabs = document.querySelector('.tabs');
    [...tabs.children].forEach(t => {
      t.classList.toggle('active', t.id === tab);
    });

    // render quizzes
    this.render();

    // scroll into view
    if (modal.type === 'ADD') {
      tabs.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else if (modal.type === 'EDIT') {
      const editedQuiz = document.getElementById(modal.quiz.id);
      editedQuiz.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }

  setState(newState) {
    this.state = newState;
  }

  async handleClick({ target }) {
    if (target.matches('.edit-quiz')) this.fillModal(target);
    else if (target.matches('.rm-quiz')) await this.deleteQuiz(target);
    else if (target.matches('.rm-quizzes')) await this.deleteSelectedQuizzes();
  }

  fillModal(target) {
    const { store } = this;
    const { quizzes } = store.getState();
    const quiz = quizzes.find(({ id }) => id === +target.parentNode.id);

    store.dispatch(setModal({
      type: 'EDIT',
      on: true,
      quiz
    }));
  }

  async deleteQuiz(target) {
    try {
      const targetId = +target.parentNode.id;
      await QuizService.removeQuiz(targetId);
      this.store.dispatch(removeQuiz(targetId));
    } catch (err) {
      this.store.dispatch(setError(err));
      console.error(err);
    }
  }

  async deleteSelectedQuizzes() {
    try {
      const res = await QuizService.removeSelectedQuizzes();
      const filteredQuizzes = await res.json();
      this.store.dispatch(removeSelectedQuizzes(filteredQuizzes));

      const tabs = document.querySelector('.tabs');
      tabs.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } catch (err) {
      this.store.dispatch(setError(err));
      console.error(err);
    }
  }

  async handleChange({ target }) {
    const { store } = this;
    const id = +target.parentNode.id;

    try {
      const res = await QuizService.selectQuiz(id, {
        selected: target.checked
      });
      const quiz = await res.json();
      store.dispatch(selectQuiz(quiz));
    } catch (err) {
      store.dispatch(setError(err));
      console.error(err);
    }
  }

  render() {
    const { state, container } = this;
    const { quizzes, tab } = state;
    const _quizzes = tab === 'all'
      ? quizzes
      : quizzes.filter(q => q.category === tab);

    container.innerHTML = `<button class="rm-quizzes">Delete Selected</button>
    <ul class="quizzes">
      ${_quizzes.map(q => Quiz(q)).join('')}
    </ul>`;
  }
}
