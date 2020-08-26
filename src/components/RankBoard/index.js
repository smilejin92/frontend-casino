import './style.scss';
import { fetchUsers } from '../../redux/modules/home';

export default class RankBoard {
  constructor({ store }) {
    this.state = { users: null };
    this.store = store;
    this.rankBoard = document.createElement('table');
    this.update = this.update.bind(this);
    this.unsubscribe = null;
    this.init();
  }

  init() {
    this.rankBoard.classList.add('rank-board');
    const { store } = this;
    const { home } = store.getState();
    const { users } = home;
    this.setState({ users });

    this.unsubscribe = store.subscribe(this.update);
    console.log('RankBoard subscribed');

    if (users.length) return;

    store.dispatch(fetchUsers());
  }

  setState(newState) {
    this.state = newState;
  }

  update() {
    const { home, router } = this.store.getState();
    if (router.page !== 'home') {
      console.log('RankBoard unsubscribed');
      this.unsubscribe();
      return;
    }

    if (this.state.users === home.users) return;

    this.setState({ users: home.users });
    this.render();
  }

  render() {
    const { users } = this.state;
    this.rankBoard.innerHTML = `<tbody>
      <tr>
        <th class="rank">Rank</th>
        <th class="username">User Name</th>
        <th class="point">Point</th>
      </tr>
      ${users.length && users.map((user, idx) => (`
          <tr>
            <td class="rank">${idx + 1}</td>
            <td class="username">${user.username}</td>
            <td class="point">${user.point}</td>
          </tr>
        `)).join('')}
    </tbody>`;

    return this.rankBoard;
  }
}
