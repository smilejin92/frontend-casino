import './style.scss';
import { setPage } from '../../redux/modules/router';
import RouterService from '../../services/RouterService';

export default class Links {
  constructor({ linkList, store }) {
    this.linkList = linkList;
    this.store = store;
    this.links = document.createElement('ul');
    this.navigatePage = this.navigatePage.bind(this);

    this.init();
  }

  init() {
    this.links.onclick = this.navigatePage;
    this.links.classList.add('links');
  }

  navigatePage(e) {
    e.preventDefault();
    if (!e.target.matches('.links a')) return;

    const { textContent } = e.target;
    const page = textContent.toLowerCase();
    const pathname = page === 'home' ? '/' : '/admin';

    const { router } = this.store.getState();
    if (router.page === page) return;

    RouterService.pushState(page, pathname);
    this.store.dispatch(setPage({ page, pathname }));
  }

  render() {
    this.links.innerHTML = this.linkList
      .map(link => `<li><a href="#">${link}</a></li>`)
      .join('');

    return this.links;
  }
}
