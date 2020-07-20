import './style.scss';
import Header from '../../components/Header';
import Logo from '../../components/Logo';
import RankBoard from '../../components/RankBoard';

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
          new Logo({ text: 'Frontend Casino' }),
          new RankBoard({ store })
        ]
      }).elem
    );

    root.appendChild(fragment);
  }
}
