import './styles/header.module.scss';
import { setModal } from '../redux/actions';
import Modal from './Modal';

export default class Header {
  constructor(store) {
    this.store = store;
    this.container = document.createElement('header');
    this.heading = document.createElement('h1');
    this.addQuizBtn = document.createElement('button');
    this.addQuizBtn.onclick = this.handleClick.bind(this);
    this.modal = new Modal(store);
    this.init();
  }

  init() {
    const { container, heading, addQuizBtn, modal } = this;
    heading.classList.add('logo', 'neon');
    heading.innerHTML = '<a role="button">Frontend Casino</a>';

    addQuizBtn.classList.add('add-quiz-btn');
    addQuizBtn.textContent = 'Add Quiz';

    container.classList.add('header');
    container.appendChild(heading);
    container.appendChild(addQuizBtn);
    container.appendChild(modal.container);
  }

  handleClick() {
    const { store } = this;
    store.dispatch(setModal({
      on: true,
      type: 'ADD'
    }));
  }
}
