import './style.scss';
import QuizService from '../../services/QuizService';
import Quiz from '../Quiz';
import {
  fetchQuizzes,
  setAdminError,
  removeQuiz,
  selectQuiz,
  setQuizForm,
  setAdminLoading
} from '../../redux/modules/admin';
import { getStore } from '../../redux/store';

export default class QuizList {
  constructor() {
    this.store = getStore();
    this.state = {};
    this.quizList = document.createElement('ul');
    this.update = this.update.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.init();
  }

  async init() {
    const {
      quizList,
      store,
      handleClick,
      handleChange,
      update
    } = this;

    quizList.classList.add('quizzes');
    quizList.onclick = handleClick;
    quizList.onchange = handleChange;

    // local & store 상태 동기화
    // store의 일부 상태(quizzes, category)만 subscribe하기 위함
    const { admin } = store.getState();
    const { quizzes, category } = admin;
    this.setState({ quizzes, category });

    // subscribe redux store
    store.subscribe(update);

    if (quizzes.length) return;

    try {
      // fetch quizzes
      store.dispatch(setAdminLoading(true));
      const res = await QuizService.fetchQuizzes();
      const _quizzes = await res.json();

      // update redux store
      store.dispatch(fetchQuizzes(_quizzes.sort((q1, q2) => q2.id - q1.id)));
    } catch (err) {
      store.dispatch(setAdminError(err));
      console.error(err);
    }
    store.dispatch(setAdminLoading(false));
  }

  setState(newState) {
    this.state = newState;
  }

  update() {
    const { state, store } = this;
    const { admin } = store.getState();
    const { category, quizzes } = admin;
    if (state.category === category && state.quizzes === quizzes) return;

    this.setState({ category, quizzes });
    this.render();
  }

  async handleClick({ target }) {
    if (target.matches('.edit-quiz')) this.fillQuizForm(target);
    else if (target.matches('.rm-quiz')) await this.deleteQuiz(target);
    else if (target.matches('.rm-quizzes')) await this.deleteSelectedQuizzes();
  }

  fillQuizForm(target) {
    const { admin } = this.store.getState();
    const { quizzes } = admin;
    const data = quizzes.find(({ id }) => (id === +target.parentNode.parentNode.id));

    this.store.dispatch(setQuizForm({
      type: 'EDIT',
      on: true,
      data
    }));
  }

  async deleteQuiz(target) {
    try {
      this.store.dispatch(setAdminLoading(true));
      const targetId = +target.parentNode.parentNode.id;
      await QuizService.removeQuiz(targetId);
      this.store.dispatch(removeQuiz(targetId));
    } catch (err) {
      this.store.dispatch(setAdminError(err));
      console.error(err);
    }
    this.store.dispatch(setAdminLoading(false));
  }

  async handleChange({ target }) {
    const id = +target.parentNode.parentNode.id;
    try {
      this.store.dispatch(setAdminLoading(true));
      const res = await QuizService.selectQuiz(id, {
        selected: target.checked
      });
      const quiz = await res.json();
      this.store.dispatch(selectQuiz(quiz));
    } catch (err) {
      this.store.dispatch(setAdminError(err));
      console.error(err);
    }
    this.store.dispatch(setAdminLoading(false));
  }

  render() {
    const { category, quizzes } = this.state;

    const _quizzes = category === 'all'
      ? quizzes
      : quizzes.filter(q => q.category === category);

    this.quizList.innerHTML = _quizzes
      .map(q => `<li class="quiz">${Quiz(q)}</li>`)
      .join('');

    return this.quizList;
  }
}
