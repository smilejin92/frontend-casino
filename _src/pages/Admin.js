/* eslint-disable class-methods-use-this */
import Main from '../components/Main';
import Summary from '../components/Summary';
import Nav from '../components/Nav';
import Categories from '../components/Categories';
import QuizList from '../components/QuizList';
import Header from '../components/Header';
import Logo from '../components/Logo';
import Links from '../components/Links';
import Container from '../components/Container';
import Chip from '../components/Chip';
import QuizForm from '../components/QuizForm';

export default class Admin {
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
          new Container({
            type: 'admin',
            children: [
              new Chip({ text: 'add quiz', type: 'admin' }),
              new QuizForm()
            ]
          })
        ]
      }).render()
    );

    fragment.appendChild(
      new Main({
        text: '메인 영역',
        children: [
          new Nav({
            text: '문제 카테고리',
            type: 'categories',
            children: [
              new Categories({
                type: 'admin',
                categoryList: ['all', 'html', 'css', 'javascript'],
              })
            ]
          }),
          new Summary(),
          new QuizList()
        ]
      }).render()
    );

    return fragment;
  }
}
