export default class Button {
  constructor() {
    this.button = document.createElement('button');
    this.handleClick = this.handleClick.bind(this);
    this.init();
  }

  get elem() {
    return this.button;
  }

  init() {
    this.button.onclick = this.handleClick;
    this.render();
  }

  handleClick() {
    window.history.pushState({ page: 'admin' }, 'Frontend Casino', '/admin');
  }

  render() {
    this.button.textContent = 'click me';
  }
}
