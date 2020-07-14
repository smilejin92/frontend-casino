import './style.scss';

export default class Main {
  constructor(props) {
    this.props = props;
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
    this.main.innerHTML = `<h2 class="a11y-hidden">${this.props.text}</h2>`;
    this.props.children.forEach(child => this.main.appendChild(child.elem));
  }
}
