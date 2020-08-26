export default class RouterService {
  static initRouter() {
    const { history, location } = window;
    const { pathname } = location;

    const page =
      pathname === '/' ? 'home' : pathname === '/admin' ? 'admin' : 'error';

    if (!history.state) {
      history.replaceState({ page }, 'Frontend Casino', pathname);
    }

    return {
      page,
      pathname,
    };
  }

  static pushState(page, pathname) {
    window.history.pushState({ page, pathname }, 'Frontend Casino', pathname);
  }
}
