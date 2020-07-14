import './style.scss';
import { toggleNav } from '../../redux/actions';

export default class Categories {
  constructor(props) {
    this.props = props;
    this.categories = document.createElement('ul');
    this.handleClick = this.handleClick.bind(this);
    this.init();
  }

  get elem() {
    return this.categories;
  }

  init() {
    this.categories.classList.add('categories');
    this.categories.onclick = this.handleClick;
    this.render();
  }

  handleClick({ target }) {
    console.log('toggleNav');
    if (!target.matches('.category a')) return;

    const { categories } = this;
    [...categories.children].forEach(c => {
      c.classList.toggle('active', c === target.parentNode);
    });

    const { store } = this.props;
    store.dispatch(toggleNav(target.parentNode.id));

    // tabs.scrollIntoView({
    //   behavior: 'smooth'
    // });
  }

  render() {
    const { store } = this.props;
    const { category } = store.getState();

    this.categories.innerHTML = this.props.categories.map(c => (
      `<li id="${c}" class="category neon ${c === category ? 'active' : ''}">
        <a role="button">${c.toUpperCase()}</a>
      </li>`
    )).join('');
  }
}

// export default class Nav {
//   constructor(store) {
//     this.store = store;
//     this.container = document.createElement('nav');
//     this.heading = document.createElement('h2');
//     this.tabs = document.createElement('ul');
//     this.tabs.onclick = this.handleClick.bind(this);
//     this.init();
//   }

//   init() {
//     const { container, heading, tabs } = this;

//     heading.classList.add('a11y-hidden');

//     tabs.classList.add('tabs');

//     container.classList.add('navigation');

//     this.render();
//   }

//   handleClick({ target }) {
//     if (!target.matches('.tab a')) return;

//     const { tabs, store } = this;
//     [...tabs.children].forEach(t => {
//       t.classList.toggle('active', t === target.parentNode);
//     });

//     store.dispatch(toggleNav(target.parentNode.id));
//     tabs.scrollIntoView({
//       behavior: 'smooth'
//     });
//   }

//   render() {
//     const { heading, container, store, tabs } = this;
//     const { tabs: tabList, tab } = store.getState();

//     heading.textContent = '문제 카테고리';
//     container.appendChild(heading);
//     container.appendChild(tabs);

//     tabs.innerHTML = tabList
//       .map(t => (
//         `<li id="${t}" class="tab neon ${t === tab ? 'active' : ''}">
//           <a role="button">${t.toUpperCase()}</a>
//         </li>`
//       ))
//       .join('');
//   }
// }