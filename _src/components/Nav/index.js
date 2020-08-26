import './style.scss';

export default class Nav {
  constructor({ text, type, children }) {
    this.text = text;
    this.type = type;
    this.children = children;
    this.nav = document.createElement('nav');
    this.init();
  }

  init() {
    this.nav.classList.add(`navigation-${this.type}`);
  }

  render() {
    const {
      nav,
      text,
      children
    } = this;

    nav.innerHTML = `<h3 class="a11y-hidden">${text}</h3>`;
    children.forEach(child => nav.appendChild(child.render()));

    return nav;
  }
}
