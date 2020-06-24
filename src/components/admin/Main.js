import Questions from './Questions';

export default class Main {
  constructor({ title }) {
    this.$container = document.createElement('main');
    this.title = title;
    this.$questions = new Questions();
    this.init();
  }

  init() {
    this.$container.classList.add('main');
    this.$container.innerHTML = `<h2 class="a11y-hidden">${this.title}</h2>`;
    this.$container.appendChild(this.$questions.$container);
  }
}
