import './style.scss';

export default class Header {
  constructor({ children }) {
    this.children = children;
    this.header = document.createElement('header');
    this.init();
  }

  // get elem() {
  //   return this.header;
  // }

  init() {
    this.header.classList.add('header');
    // this.render();
  }

  render() {
    const { children, header } = this;
    children.forEach(child => header.appendChild(child.render()));

    return header;
  }
}
