import './style.scss';
import Header from '../../components/Header';
import Logo from '../../components/Logo';

export default class Home {
  constructor({ root, store }) {
    this.root = root;
    this.store = store;
    this.init();
    this.render();
  }

  init() {
    this.root.classList.remove('admin');
    this.root.classList.add('home');
    this.render();
  }

  render() {
    const { root, store } = this;
    root.innerHTML = '';

    const fragment = document.createDocumentFragment();

    fragment.appendChild(
      new Header({
        children: [
          new Logo({ text: 'Frontend Casino' })
        ]
      }).elem
    );

    root.appendChild(fragment);
  }
}
