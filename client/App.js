import './style.scss';
import { getStore } from './redux/store';
import { setPage } from './redux/modules/router';
import Home from './pages/Home';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import Logo from './components/Logo';
import Nav from './components/Nav';
import Links from './components/Links';
import RankBoard from './components/RankBoard';
import Container from './components/Container';
import Chip from './components/Chip';
import QuizForm from './components/QuizForm';

export default class App {
  constructor() {
    this.root = document.getElementById('root');
    this.state = {
      page: '',
      routes: {
        home: new Home().render(), // which is better?
        admin: new Admin().render(),
        notFound: new NotFound().render(),
      },
    };
    this.update = this.update.bind(this);

    this.init();
  }

  init() {
    // init local state
    // why? store의 router.page 변화만을 비교하기 위함
    const store = getStore();
    const { router } = store.getState();

    this.setState({
      ...this.state,
      page: router.page,
    });

    // store update 구독
    store.subscribe(this.update);

    // popstate handler
    window.onpopstate = ({ state }) => {
      const { page } = state;
      store.dispatch(setPage(page));
    };
  }

  setState(newState) {
    this.state = newState;
  }

  update() {
    const store = getStore();
    const { router } = store.getState();
    if (this.state.page === router.page) return;

    this.setState({
      ...this.state,
      page: router.page,
    });

    this.render();
  }

  render() {
    console.log('App render');
    const { page, routes } = this.state;
    const Page = routes[page];
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
          page === 'home'
            ? new RankBoard()
            : page === 'admin'
              ? new Container({
                type: 'admin',
                children: [
                  new Chip({ text: 'add quiz', type: 'admin' }),
                  new QuizForm()
                ]
              })
              : new Chip({ text: 'add quiz', type: 'admin' }), // need to change
        ],
      }).render()
    );

    fragment.appendChild(Page);

    this.root.innerHTML = '';
    this.root.appendChild(fragment);
  }
}
