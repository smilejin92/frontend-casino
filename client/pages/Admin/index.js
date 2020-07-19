import './style.scss';
import Header from '../../components/Header';
import Logo from '../../components/Logo';
import Chip from '../../components/Chip';
import Main from '../../components/Main';
import Summary from '../../components/Summary';
import Nav from '../../components/Nav';
import CategoryList from '../../components/CategoryList';
import QuizList from '../../components/QuizList';
import QuizForm from '../../components/QuizForm';

export default class Admin {
  constructor({ root, store }) {
    this.root = root;
    this.store = store;
    this.render();
  }

  render() {
    const { root, store } = this;
    const fragment = document.createDocumentFragment();

    fragment.appendChild(
      new Header({
        children: [
          new Logo({ text: 'Frontend Casino' }),
          new Chip({
            text: 'Add Quiz',
            type: 'admin',
            store
          }),
          new QuizForm({ store })
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
              new CategoryList({
                type: 'admin',
                categories: ['all', 'html', 'css', 'javascript'],
                store
              })
            ]
          }),
          new Summary({ store }),
          new QuizList({ store })
        ]
      }).elem
    );

    root.appendChild(fragment);
  }
}
