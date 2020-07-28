import './style.scss';

export default class Logo {
  constructor({ text }) {
    this.text = text;
    this.logo = document.createElement('h1');
    this.init();
  }

  // get elem() {
  //   return this.logo;
  // }

  init() {
    this.logo.classList.add('logo', 'neon');
    // this.render();
  }

  render() {
    const { logo, text } = this;
    logo.innerHTML = `<a role="button">${text}</a>`;

    return logo;
  }
}
