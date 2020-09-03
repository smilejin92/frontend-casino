import './style.scss';

export default class Header {
  constructor({ children }) {
    this.children = children;
    this.header = document.createElement('header');
    this.init();
  }

  init() {
    this.header.classList.add('header');
  }

  render() {
    const { children, header } = this;
    children.forEach(child => header.appendChild(child.render()));

    return header;
  }
}
