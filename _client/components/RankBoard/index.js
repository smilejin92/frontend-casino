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

  // get elem() {
  //   return this.rankBoard;
  // }

  async init() {
    this.setState({
      users: this.store.getState().home.users
    });

    this.store.subscribe(this.update.bind(this));
    try {
      const res = await UserService.fetchUsers();
      const users = await res.json();
      this.store.dispatch(fetchUsers(users));
      // this.render();
    } catch (err) {
      console.error(err);
    }
  }

  setState(newState) {
    this.state = newState;
  }

  update() {
    const { users } = this.store.getState().home;
    if (this.state.users === users) return;
    this.setState({ users });
    this.render();
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

    return this.rankBoard;
  }
}
