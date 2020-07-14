import './style.scss';
import Nav from './Nav';
import Quizzes from './Quizzes';

export default class AdminMain {
  constructor(store) {
    this.container = document.createElement('main');
    this.heading = document.createElement('h2');
    this.nav = new Nav(store);
    this.quizzes = new Quizzes(store);
    this.init();
  }

  init() {
    const { container, heading } = this;
    heading.classList.add('a11y-hidden');
    container.classList.add('main');
  }

  render() {
    const {
      container,
      heading,
      nav,
      quizzes
    } = this;

    heading.textContent = '메인 영역';
    container.appendChild(heading);
    container.appendChild(nav.container);
    container.appendChild(quizzes.container);
  }
}
