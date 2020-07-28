import Main from '../components/Main';
import Summary from '../components/Summary';
import Nav from '../components/Nav';
import Categories from '../components/Categories';
import QuizList from '../components/QuizList';

export default class Admin {
  render() {
    return new Main({
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
    }).render();
  }
}
