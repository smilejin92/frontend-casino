/* eslint-disable class-methods-use-this */
import Header from '../components/Header';
import Logo from '../components/Logo';
import Nav from '../components/Nav';
import Links from '../components/Links';
import NotFoundMessage from '../components/NotFoundMessage';

export default class NotFound {
  render() {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(
      new Header({
        children: [
          new Logo({ text: 'Frontend Casino' }),
          new Nav({
            text: '페이지 내비게이션',
            type: 'links',
            children: [
              new Links({ linkList: ['Home', 'Admin'] })
            ]
          }),
          new NotFoundMessage({ text: '페이지를 찾을 수 없습니다.' })
        ]
      }).render()
    );

    return fragment;
  }
}
