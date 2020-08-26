import './style.scss';
import Home from './pages/Home';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import { setPage } from './redux/modules/router';

export default class App {
  constructor({ root, store }) {
    this.root = root;
    this.store = store;
    this.state = {
      page: null,
      routes: {
        home: Home,
        admin: Admin,
        error: NotFound,
      },
    };
    this.update = this.update.bind(this);
    this.handlePopState = this.handlePopState.bind(this);

    this.init();
  }

  init() {
    const { router } = this.store.getState();

    this.setState({
      ...this.state,
      page: router.page,
    });

    this.store.subscribe(this.update);
    window.onpopstate = this.handlePopState;
  }

  setState(newState) {
    this.state = newState;
  }

  update() {
    const { router } = this.store.getState();
    if (this.state.page === router.page) return;

    this.setState({
      ...this.state,
      page: router.page,
    });

    this.render();
  }

  handlePopState({ state }) {
    this.store.dispatch(setPage({ ...state }));
  }

  render() {
    const { store, state } = this;
    const { page, routes } = state;
    const Page = routes[page];

    this.root.innerHTML = '';
    this.root.appendChild(new Page({ store }).render());
  }
}
