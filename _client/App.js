import './style.scss';
import store from './redux/store';
import Home from './pages/Home';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import { setPage } from './redux/modules/router';

export default class App {
  constructor() {
    this.routes = {
      home: Home,
      admin: Admin,
      error: NotFound
    };
    this.update = this.update.bind(this);
    this.handlePopState = this.handlePopState.bind(this);
    this.init();
  }

  init() {
    const { history, location } = window;
    const { pathname } = location;

    const page = pathname === '/'
      ? 'home'
      : pathname === '/admin'
        ? 'admin'
        : 'error';

    if (!history.state) {
      history.replaceState({ page }, 'Frontend Casino', pathname);
    }

    window.onpopstate = this.handlePopState;

    store.subscribe(this.update);
    store.dispatch(setPage(page));
    // this.render(page);
  }

  update() {
    const { router } = store.getState();
    const { state } = window.history;
    if (state.page === router.page) return;
    this.render();
  }

  handlePopState() {
    console.log('handlePopState');
    const historyState = window.history.state;
    if (!historyState) return;

    this.root.innerHTML = '';
    this.render(historyState.page);
  }

  render() {
    const { history, location } = window;
    const { pathname } = location;

    const page = pathname === '/'
      ? 'home'
      : pathname === '/admin'
        ? 'admin'
        : 'error';

    if (!history.state) {
      history.replaceState({ page }, 'Frontend Casino', pathname);
    }

    const fragment = document.createDocumentFragment();
    const Page = this.routes[page];

    fragment.appendChild(new Page({ store }).render());

    return fragment;
  }
}
