import './styles/nav.module.scss';
import { toggleNav } from '../redux/actions';

export default class Nav {
  constructor(store) {
    this.store = store;
    this.container = document.createElement('nav');
    this.heading = document.createElement('h2');
    this.tabs = document.createElement('ul');
    this.tabs.onclick = this.handleClick.bind(this);
    this.init();
  }

  init() {
    const { store, container, heading, tabs } = this;
    const { tabs: _tabs, tab } = store.getState();

    let tabsInnerHtml = '';
    _tabs.forEach(t => {
      tabsInnerHtml += `<li id="${t}" class="tab neon ${t === tab ? 'active' : ''}">
        <a role="button">${t.toUpperCase()}</a>
      </li>`;
    });

    heading.textContent = '문제 카테고리';
    heading.classList.add('a11y-hidden');

    tabs.classList.add('tabs');
    tabs.innerHTML = tabsInnerHtml;

    container.classList.add('navigation');
    container.appendChild(heading);
    container.appendChild(tabs);
  }

  handleClick({ target }) {
    if (!target.matches('.tab a')) return;

    const { tabs, store } = this;
    [...tabs.children].forEach(t => {
      t.classList.toggle('active', t === target.parentNode);
    });

    store.dispatch(toggleNav(target.parentNode.id));
    tabs.scrollIntoView({
      behavior: 'smooth'
    });
  }
}
