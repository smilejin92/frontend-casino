import './styles/main.module.scss';
import Nav from './Nav';
import Quizzes from './Quizzes';

export default class Main {
  constructor(store) {
    this.container = document.createElement('main');
    this.heading = document.createElement('h2');
    this.nav = new Nav(store);
    this.quizzes = new Quizzes(store);
    this.init();
  }

  init() {
    const { container, heading, nav, quizzes } = this;
    heading.classList.add('a11y-hidden');
    heading.textContent = '메인 영역';

    container.classList.add('main');
    container.appendChild(heading);
    container.appendChild(nav.container);
    container.appendChild(quizzes.container);
  }
}
