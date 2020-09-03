import Header from '../components/Header';
import Logo from '../components/Logo';
import Nav from '../components/Nav';
import Links from '../components/Links';
import Container from '../components/Container';
import Chip from '../components/Chip';
import QuizForm from '../components/QuizForm';
import Main from '../components/Main';
import Categories from '../components/Categories';
import Summary from '../components/Summary';
import QuizList from '../components/QuizList';

export default class Admin {
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
          new Container({
            type: 'admin',
            children: [
              new Chip({ store, type: 'admin', text: 'add quiz' }),
              new QuizForm({ store }),
            ],
          }),
        ],
      }).render()
    );

    // fragment.appendChild(
    //   new Main({
    //     text: '메인 영역',
    //     children: [
    //       new Nav({
    //         text: '문제 카테고리',
    //         type: 'categories',
    //         children: [
    //           new Categories({
    //             store,
    //             type: 'admin',
    //             categoryList: ['all', 'html', 'css', 'javascript']
    //           })
    //         ]
    //       }),
    //       new Summary({ store }),
    //       new QuizList({ store })
    //     ]
    //   }).render()
    // );

    return fragment;
  }
}
