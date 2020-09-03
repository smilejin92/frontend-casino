import Header from '../components/Header';
import Logo from '../components/Logo';
import Nav from '../components/Nav';
import Links from '../components/Links';
import RankBoard from '../components/RankBoard';
import Main from '../components/Main';
import Container from '../components/Container';
import PointTable from '../components/PointTable';
import HelpButton from '../components/HelpButton';
import HelpContent from '../components/HelpContent';

export default class Home {
  constructor({ store }) {
    this.store = store;
  }

  render() {
    const { store } = this;
    const fragment = document.createDocumentFragment();
    fragment.appendChild(
      new Header({
        children: [
          new Logo({ text: 'Frontend Casino' }),
          new Nav({
            text: '페이지 내비게이션',
            type: 'links',
            children: [new Links({ store, linkList: ['Home', 'Admin'] })],
          }),
          new RankBoard({ store })
        ],
      }).render()
    );

    fragment.appendChild(
      new Main({
        text: '메인 영역',
        children: [
          new PointTable({ store }),
          new Container({
            type: 'help',
            children: [
              new HelpButton({ store }),
              new HelpContent({ store })
            ],
          })
        ]
      }).render()
    );

    return fragment;
  }
}
