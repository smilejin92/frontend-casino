import './style.scss';
import UserService from '../../services/UserService';
import { fetchUsers } from '../../redux/modules/home';

export default class RankBoard {
  constructor({ store }) {
    this.store = store;
    this.state = {};
    this.rankBoard = document.createElement('table');
    this.init();
  }

  get elem() {
    return this.rankBoard;
  }

  async init() {
    try {
      const res = await UserService.fetchUsers();
      const users = await res.json();
      this.store.dispatch(fetchUsers(users));
      this.render();
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const { users } = this.store.getState().home;
    this.rankBoard.innerHTML = `<tbody>
      <tr>
        <th>Rank</th>
        <th>User Name</th>
        <th>Point</th>
      </tr>
      ${users.map(({ id, username, point }) => (`
        <tr>
          <td>${id}</td>
          <td>${username}</td>
          <td>${point}</td>
        </tr>
      `)).join('')}
    </tbody>`;
  }
}
