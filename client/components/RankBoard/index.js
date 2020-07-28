import './style.scss';
import { getStore } from '../../redux/store';
import { fetchUsers } from '../../redux/modules/home';
import { setError } from '../../redux/modules/admin';
import UserService from '../../services/UserService';

export default class RankBoard {
  constructor() {
    this.state = {
      users: []
    };
    this.rankBoard = document.createElement('table');
    this.update = this.update.bind(this);
    this.init();
  }

  async init() {
    this.rankBoard.classList.add('rank-board');
    const store = getStore();
    store.subscribe(this.update);

    const { home } = store.getState();
    const { users } = home;
    this.setState({ users });
    if (users.length) return;

    try {
      const res = await UserService.fetchUsers();
      const _users = await res.json();
      store.dispatch(fetchUsers(_users));
    } catch (err) {
      store.dispatch(setError(err));
      console.error(err);
    }
  }

  setState(newState) {
    this.state = newState;
  }

  update() {
    const store = getStore();
    const { home } = store.getState();
    if (this.state.users === home.users) return;
    this.setState({
      users: home.users
    });
    this.render();
  }

  render() {
    console.log('render RankTable');
    const { users } = this.state;
    this.rankBoard.innerHTML = `<tbody>
      <tr>
        <th class="rank">Rank</th>
        <th class="username">User Name</th>
        <th class="point">Point</th>
      </tr>
      ${users.length && users
    .sort((u1, u2) => u2.point - u1.point)
    .map((user, idx) => (`
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
