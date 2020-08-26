import './style.scss';
import { getStore } from '../../redux/store';
import { setPage } from '../../redux/modules/router';

function navigatePage(e) {
  e.preventDefault();
  if (!e.target.matches('.links a')) return;

  const { textContent } = e.target;
  const page = textContent.toLowerCase();
  const path = page === 'home' ? '/' : '/admin';

  const store = getStore();
  const { router } = store.getState();
  if (router.page === page) return;

  window.history.pushState({ page }, 'Frontend Casino', path);
  store.dispatch(setPage(page));
}

export default class Links {
  constructor({ linkList }) {
    this.linkList = linkList;
    this.links = document.createElement('ul');
    this.init();
  }

  init() {
    this.links.onclick = navigatePage;
    this.links.classList.add('links');
  }

  render() {
    this.links.innerHTML = this.linkList
      .map(link => `<li><a href="#">${link}</a></li>`)
      .join('');

    return this.links;
  }
}
