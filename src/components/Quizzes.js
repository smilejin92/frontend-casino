import './styles/quizzes.module.scss';
import Quiz from './Quiz';
import QuizService from '../services/QuizService';
import { fetchQuizzes, setError, setModal, removeQuiz, selectQuiz, removeSelectedQuizzes } from '../redux/actions';

export default class Quizzes {
  constructor(store) {
    this.store = store;

    const { tab, quizzes } = store.getState();
    this.currentTab = tab;
    this.currentQuizzes = quizzes;

    this.container = document.createElement('div');
    this.quizzes = document.createElement('ul');
    this.deleteSelectedBtn = document.createElement('button');
    this.init();
  }

  async init() {
    const {
      container,
      quizzes,
      store,
      update,
      deleteSelectedBtn
    } = this;

    quizzes.classList.add('quizzes');
    deleteSelectedBtn.textContent = 'Delete Selected';

    quizzes.onclick = async ({ target }) => {
      if (target.matches('.edit-quiz')) {
        store.dispatch(setModal({
          type: 'EDIT',
          on: true,
          id: +target.parentNode.id
        }));
      } else if (target.matches('.rm-quiz')) {
        const targetId = +target.parentNode.id;
        await QuizService.removeQuiz(targetId);
        store.dispatch(removeQuiz(targetId));
        console.log('remove quiz');
      }
    };

    quizzes.onchange = async ({ target }) => {
      console.log('onchange');
      console.log(target.parentNode.id);
      console.log(target.checked);

      const id = +target.parentNode.id;
      const res = await QuizService.selectQuiz(id, {
        selected: target.checked
      });
      const quiz = await res.json();
      store.dispatch(selectQuiz(quiz));
    };

    deleteSelectedBtn.onclick = async () => {
      const res = await QuizService.removeSelectedQuizzes();
      const filteredQuizzes = await res.json();
      store.dispatch(removeSelectedQuizzes(filteredQuizzes));

      const tabs = document.querySelector('.tabs');
      tabs.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    };

    store.subscribe(update.bind(this));

    try {
      const res = await QuizService.fetchQuizzes();
      const _quizzes = await res.json();
      store.dispatch(fetchQuizzes(_quizzes.sort((a, b) => b.id - a.id)));

      container.appendChild(deleteSelectedBtn);
      container.appendChild(quizzes);
    } catch (err) {
      store.dispatch(setError(err));
      console.error(err);
    }
  }

  update() {
    const {
      currentTab,
      currentQuizzes,
      store
    } = this;

    const { tab, quizzes, modal } = store.getState();
    if (currentTab === tab && currentQuizzes === quizzes) return;

    console.log('update quizzes');

    this.currentTab = tab;
    this.currentQuizzes = quizzes;

    const tabs = document.querySelector('.tabs');
    [...tabs.children].forEach(t => {
      t.classList.toggle('active', t.id === tab);
    });

    this.render();
    if (modal.type === 'ADD') {
      tabs.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else if (modal.type === 'EDIT') {
      console.log('scroll to edited quiz');
      const editedQuiz = document.getElementById(modal.id);

      editedQuiz.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }

  render() {
    const { quizzes, currentTab, currentQuizzes } = this;

    const _quizzes = currentTab === 'all'
      ? currentQuizzes
      : currentQuizzes.filter(q => q.category === currentTab);

    quizzes.innerHTML = _quizzes.map(q => Quiz(q)).join('');
  }
}
