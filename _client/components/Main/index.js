import './style.scss';

export default class Main {
  constructor({ text, children }) {
    this.text = text;
    this.children = children;
    this.main = document.createElement('main');
    this.init();
  }

  get elem() {
    return this.main;
  }

  init() {
    this.main.classList.add('main');
    this.render();
  }

  render() {
    const {
      main,
      text,
      children
    } = this;

    main.innerHTML = `<h2 class="a11y-hidden">${text}</h2>`;
    children.forEach(child => main.appendChild(child.elem));
  }
}
