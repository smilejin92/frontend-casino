import './style.scss';

export default class Container {
  constructor({ type, children }) {
    this.type = type;
    this.children = children;
    this.container = document.createElement('div');
    this.init();
  }

  init() {
    this.container.classList.add(this.type);
  }

  render() {
    this.children.forEach(child => this.container.appendChild(child.render()));

    return this.container;
  }
}
