import './style.scss';
import { getStore } from './redux/store';
import { setPage } from './redux/modules/router';
import Home from './pages/Home';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

export default class App {
  constructor() {
    this.root = document.getElementById('root');
    this.store = getStore();
    this.state = {
      page: '',
      routes: {
        home: new Home(),
        admin: new Admin(),
        error: new NotFound()
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

  handlePopState({ state }) {
    const { page } = state;
    this.store.dispatch(setPage(page));
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

  render() {
    const { page, routes } = this.state;
    const Page = routes[page];

    this.root.innerHTML = '';
    this.root.appendChild(Page.render());
  }
}
