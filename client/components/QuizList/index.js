import './style.scss';
import QuizService from '../../services/QuizService';
import Quiz from '../Quiz';
import {
  fetchQuizzes,
  setError,
  removeQuiz,
  selectQuiz,
  removeSelectedQuizzes,
  setQuizForm
} from '../../redux/actions';

export default class QuizList {
  constructor(props) {
    this.props = props;
    this.quizList = document.createElement('ul');
    this.update = this.update.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.init();
  }

  get elem() {
    return this.quizList;
  }

  async init() {
    this.quizList.classList.add('quizzes');
    this.quizList.onclick = this.handleClick;
    this.quizList.onchange = this.handleChange;

    // local & store 상태 동기화
    // store의 일부 상태(quizzes, category)만 subscribe하기 위함
    const { store } = this.props;
    const { quizzes, category } = store.getState();
    this.setState({ quizzes, category });

    // subscribe redux store
    store.subscribe(this.update);

    try {
      // fetch quizzes
      const res = await QuizService.fetchQuizzes();
      const _quizzes = await res.json();

      // update redux store
      store.dispatch(fetchQuizzes(_quizzes.sort((q1, q2) => q2.id - q1.id)));
    } catch (err) {
      store.dispatch(setError(err));
      console.error(err);
    }
  }

  setState(newState) {
    this.state = newState;
  }

  update() {
    const { state } = this;
    const { store } = this.props;

    // 이전 상태(local state)와 동일하면 return
    const { category, quizzes, quizForm } = store.getState();
    if (state.category === category && state.quizzes === quizzes) return;

    // local 상태 최신화
    this.setState({ category, quizzes });

    // render quizzes
    this.render();

    if (quizForm.type === 'EDIT') {
      const editedQuiz = document.getElementById(quizForm.quiz.id);
      editedQuiz.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }

  async handleClick({ target }) {
    if (target.matches('.edit-quiz')) this.fillQuizForm(target);
    else if (target.matches('.rm-quiz')) await this.deleteQuiz(target);
    else if (target.matches('.rm-quizzes')) await this.deleteSelectedQuizzes();
  }

  fillQuizForm(target) {
    const { store } = this.props;
    const { quizzes } = store.getState();
    const data = quizzes.find(({ id }) => id === +target.parentNode.parentNode.id);

    store.dispatch(setQuizForm({
      type: 'EDIT',
      on: true,
      data
    }));
  }

  async deleteQuiz(target) {
    const { store } = this.props;
    try {
      const targetId = +target.parentNode.parentNode.id;
      await QuizService.removeQuiz(targetId);
      store.dispatch(removeQuiz(targetId));
    } catch (err) {
      store.dispatch(setError(err));
      console.error(err);
    }
  }

  async deleteSelectedQuizzes() {
    const { store } = this.props;
    try {
      const res = await QuizService.removeSelectedQuizzes();
      const filteredQuizzes = await res.json();
      store.dispatch(removeSelectedQuizzes(filteredQuizzes));

      const categories = document.querySelector('categories');
      categories.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } catch (err) {
      store.dispatch(setError(err));
      console.error(err);
    }
  }

  async handleChange({ target }) {
    const { store } = this.props;
    const id = +target.parentNode.parentNode.id;

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
    const { category, quizzes } = this.state;

    const _quizzes = category === 'all'
      ? quizzes
      : quizzes.filter(q => q.category === category);

    this.quizList.innerHTML = _quizzes
      .map(q => Quiz(q))
      .join('');
  }
}
