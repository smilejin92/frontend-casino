export default class Questions {
  constructor() {
    this.$container = document.createElement('ul');
    this.init();
  }

  init() {
    this.$container.classList.add('questions');
  }
}
