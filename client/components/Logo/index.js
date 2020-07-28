import './style.scss';

export default class Logo {
  constructor({ text }) {
    this.text = text;
    this.logo = document.createElement('h1');
    this.init();
  }

  init() {
    this.logo.classList.add('logo', 'neon');
  }

  render() {
    const { logo, text } = this;
    logo.innerHTML = `<a href="#">${text}</a>`;

    return logo;
  }
}
