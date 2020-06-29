import '@babel/polyfill';
import './components/styles/admin.module.scss';
import Header from './components/Header';
import Main from './components/Main';
import store from './redux/store';

class Admin {
  constructor() {
    this.root = document.getElementById('root');
    this.header = new Header(store);
    this.main = new Main(store);
    this.init();
  }

  init() {
    const { root, header, main } = this;
    root.appendChild(header.container);
    root.appendChild(main.container);
  }
}

new Admin();
