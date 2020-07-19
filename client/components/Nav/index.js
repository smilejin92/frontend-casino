import './style.scss';

export default class Nav {
  constructor({ text, children }) {
    this.text = text;
    this.children = children;
    this.nav = document.createElement('nav');
    this.init();
  }

  get elem() {
    return this.nav;
  }

  init() {
    this.nav.classList.add('navigation'); // props로 style 입력받을 것
    this.render();
  }

  render() {
    const {
      nav,
      text,
      children
    } = this;

    nav.innerHTML = `<h3 class="a11y-hidden">${text}</h3>`;
    children.forEach(child => nav.appendChild(child.elem));
  }
}
