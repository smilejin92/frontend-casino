import './style.scss';
import store from './redux/store';
import Home from './pages/Home';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

export default class App {
  constructor({ root }) {
    this.root = root;
    this.routes = {
      home: Home,
      admin: Admin,
      error: NotFound
    };
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
      history.replaceState({ page }, 'Frontend Casino');
    }

    window.onpopstate = this.handlePopState;
    this.render(page);
  }

  handlePopState() {
    const historyState = window.history.state;
    if (!historyState) return;

    this.root.innerHTML = '';
    this.render(historyState.page);
  }

  render(page) {
    const Page = this.routes[page];
    new Page({ root: this.root, store });
  }
}
