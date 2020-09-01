import './style.scss';
import { fetchQuizzes } from '../../redux/modules/admin';

export default class PointTable {
  constructor({ store }) {
    this.store = store;
    this.state = {
      pointRemained: null,
      countSucceeded: null,
      countPlayed: null,
      countQuizzes: null,
      playedQuizzesIds: null,
    };
    this.pointTable = document.createElement('dl');
    this.update = this.update.bind(this);
    this.unsubscribe = null;
    this.init();
  }

  init() {
    this.pointTable.classList.add('point-table');
    const { home, admin } = this.store.getState();
    const { pointRemained, countSucceeded, countPlayed, playedQuizzesIds } = home;
    const { quizzes } = admin;
    // if (!admin.quizzes.length) {
    //   this.store.dispatch(fetchQuizzes());
    // }

    this.setState({
      pointRemained,
      countSucceeded,
      countPlayed,
      playedQuizzesIds,
      countQuizzes: quizzes.length
    });

    this.unsubscribe = this.store.subscribe(this.update);
    console.log('PointTable subscribed');
  }

  update() {
    const { router } = this.store.getState();
    if (router.page !== 'home') {
      this.unsubscribe();
      console.log('PointTable unsubscribed');
      return;
    }
  }

  setState(newState) {
    this.state = newState;
  }

  render() {
    const { pointRemained, countSucceeded, countPlayed, countQuizzes } = this.state;

    this.pointTable.innerHTML = `
      <div class="cell-info point-remained">
        <dt>보유 포인트</dt>
        <dd>${pointRemained}</dd>
      </div>
      <div class="cell-info">
        <dt>성공</dt>
        <dd>${countSucceeded}</dd>
      </div>
      <div class="cell-info">
        <dt>실패</dt>
        <dd>${countPlayed - countSucceeded}</dd>
      </div>
      <div class="cell-info">
        <dt>성공률</dt>
        <dd>${(countSucceeded / countPlayed) * 100 || 0}</dd>
      </div>
      <div class="cell-info quiz-remained">
        <dt>남은 퀴즈</dt>
        <dd>${countQuizzes - countPlayed}</dd>
      </div>
    `;

    return this.pointTable;
  }
}
