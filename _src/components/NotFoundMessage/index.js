import './style.scss';

export default class NotFoundMessage {
  constructor({ text }) {
    this.text = text;
    this.container = document.createElement('p');
    this.container.classList.add('not-found');
  }

  render() {
    this.container.textContent = this.text;
    return this.container;
  }
}
