import Menu from './Menu';

export default class Nav {
  constructor({ title }) {
    this.title = title;
    this.$container = document.createElement('nav');
    this.$menu = new Menu();
    this.init();
  }

  init() {
    this.$container.classList.add('navigation');
    this.$container.innerHTML = `<h2 class="a11y-hidden">${this.title}</h2>`;
    this.$container.appendChild(this.$menu.$container);
  }
}
