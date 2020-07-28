import './style.scss';
import Header from '../../components/Header';
import Logo from '../../components/Logo';
import RankBoard from '../../components/RankBoard';
// import Button from '../../components/Button';

export default class Home {
  constructor({ store }) {
    // this.root = root;
    this.store = store;
    this.init();
  }

  init() {
    // this.root.classList.remove('admin');
    // this.root.classList.add('home');
    // this.render();
  }

  render() {
    const { store } = this;
    const fragment = document.createDocumentFragment();

    fragment.appendChild(
      new Header({
        children: [
          new Logo({ text: 'Frontend Casino' }),
          new RankBoard({ store }),
          // new Button()
        ]
      }).render()
    );

    return fragment;
  }
}
