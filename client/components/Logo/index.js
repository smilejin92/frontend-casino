import './style.scss';

// 텍스트를 전달 받는다.
export default class Logo {
  constructor(props) {
    this.props = props;
    this.logo = document.createElement('h1');
    this.init();
  }

  get elem() {
    return this.logo;
  }

  init() {
    this.logo.classList.add('logo', 'neon');
    this.render();
  }

  render() {
    const { logo, props } = this;
    logo.innerHTML = `<a role="button">${props.text}</a>`;
  }
}
