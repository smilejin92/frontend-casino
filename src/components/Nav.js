import './styles/nav.module.scss';
import { toggleNav } from '../redux/actions';

export default class Nav {
  constructor(store) {
    this.store = store;
    this.container = document.createElement('nav');
    this.heading = document.createElement('h2');
    this.menu = document.createElement('ul');
    this.menu.onclick = this.handleClick.bind(this);
    this.init();
  }

  init() {
    const { store, container, heading, menu } = this;
    const { menu: _menu, tab } = store.getState();

    let menuItems = '';
    _menu.forEach(item => {
      menuItems += `<li id="${item}" class="menu-item neon ${item === tab ? 'active' : ''}">
        <a role="button">${item.toUpperCase()}</a>
      </li>`;
    });

    heading.textContent = '문제 카테고리';
    heading.classList.add('a11y-hidden');

    menu.classList.add('menu');
    menu.innerHTML = menuItems;

    container.classList.add('navigation');
    container.appendChild(heading);
    container.appendChild(menu);
  }

  handleClick({ target }) {
    if (!target.matches('.menu-item a')) return;

    const { menu, store } = this;
    [...menu.children].forEach(item => {
      item.classList.toggle('active', item === target.parentNode);
    });

    store.dispatch(toggleNav(target.parentNode.id));
  }
}
