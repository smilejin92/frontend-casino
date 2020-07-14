import './style.scss';
import Header from '../../components/Header';
import Logo from '../../components/Logo';
import Chip from '../../components/Chip';
import Main from '../../components/Main';
import Nav from '../../components/Nav';
import Categories from '../../components/Categories';
import QuizList from '../../components/QuizList';

export default class Admin {
  constructor(root, store) {
    this.store = store;
    this.root = root;
    this.render();
  }

  render() {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(
      new Header({
        children: [
          new Logo({ text: 'Frontend Casino' }),
          new Chip({
            text: 'Add Quiz',
            type: 'admin',
            store: this.store
          })
        ]
      }).elem
    );
    fragment.appendChild(
      new Main({
        text: '메인 영역',
        children: [
          new Nav({
            text: '문제 카테고리',
            children: [
              new Categories({
                store: this.store,
                type: 'admin',
                categories: ['all', 'html', 'css', 'javascript']
              })
            ]
          }),
          new QuizList({
            store: this.store
          })
        ]
      }).elem
    );
    this.root.appendChild(fragment);
  }
}
