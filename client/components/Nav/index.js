import './style.scss';

export default class Nav {
  constructor(props) {
    this.props = props;
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
    this.nav.innerHTML = `<h3 class="a11y-hidden">${this.props.text}</h3>`;
    this.props.children.forEach(child => this.nav.appendChild(child.elem));
  }
}
