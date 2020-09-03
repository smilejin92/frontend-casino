import './style.scss';
import Quiz from '../Quiz';
import { fetchQuizzes, setQuizForm, deleteQuiz, selectQuiz } from '../../redux/modules/admin';

export default class QuizList {
  constructor({ store }) {
    this.store = store;
    this.state = {
      quizzes: null,
      category: null,
    };
    this.quizList = document.createElement('ul');
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.update = this.update.bind(this);
    this.unsubscribe = null;
    this.init();
  }

  init() {
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
    this.unsubscribe = store.subscribe(update);
    console.log('QuizList subscribed');

    // admin page -> home -> admin page 일때 요청 X
    if (quizzes.length) return;

    store.dispatch(fetchQuizzes());
  }

  setState(newState) {
    this.state = newState;
  }

  update() {
    const { state, store } = this;
    const { admin, router } = store.getState();
    if (router.page !== 'admin') {
      console.log('QuizList unsubscribed');
      this.unsubscribe();
      return;
    }

    const { category, quizzes } = admin;
    if (state.category === category && state.quizzes === quizzes) return;

    this.setState({ category, quizzes });
    this.render();
  }

  handleClick({ target }) {
    const id = +target.parentNode.parentNode.id;
    if (target.matches('.edit-quiz')) this.fillQuizForm(id);
    if (target.matches('.rm-quiz')) this.store.dispatch(deleteQuiz(id));
  }

  fillQuizForm(id) {
    const { admin } = this.store.getState();
    const { quizzes } = admin;
    const data = quizzes.find(q => (q.id === id));

    this.store.dispatch(setQuizForm({
      type: 'EDIT',
      on: true,
      data
    }));
  }

  handleChange({ target }) {
    const id = +target.parentNode.parentNode.id;
    const selected = target.checked;
    this.store.dispatch(selectQuiz({ id, selected }));
  }

  render() {
    const { category, quizzes } = this.state;
    // if quiz.length === 0

    const filteredQuizzes = category === 'all'
      ? quizzes
      : quizzes.filter(q => q.category === category);

    this.quizList.innerHTML = filteredQuizzes
      .map(q => `<li class="quiz">${Quiz(q)}</li>`)
      .join('');

    return this.quizList;
  }
}
