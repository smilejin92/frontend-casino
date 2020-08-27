import Header from '../components/Header';
import Logo from '../components/Logo';
import Nav from '../components/Nav';
import Links from '../components/Links';
import RankBoard from '../components/RankBoard';
import Main from '../components/Main';
import GameIntro from '../components/GameIntro';

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
          new GameIntro({
            text: 'Frontend Casino에 오신 것을 환영합니다.',
            store
          })
        ]
      }).render()
    );

    return fragment;
  }
}
