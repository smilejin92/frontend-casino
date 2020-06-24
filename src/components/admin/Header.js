import Nav from './Nav';

export default class Header {
  constructor({ title, toggleNav }) {
    this.title = title;
    this.$container = document.createElement('header');
    this.$nav = new Nav({
      title: '메인 메뉴',
      toggleNav
    });
    this.init();
  }

  init() {
    this.$container.classList.add('header');
    this.$container.innerHTML = `<h1 class="main-title">${this.title}</h1>`;
    this.$container.appendChild(this.$nav.$container);
  }
}
