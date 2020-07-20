import './style.scss';
import { toggleNav } from '../../redux/modules/admin';

export default class CategoryList {
  constructor({ type, categories, store }) {
    this.type = type;
    this.categories = categories;
    this.store = store;
    this.state = {};
    this.categoryList = document.createElement('ul');
    this.handleClick = this.handleClick.bind(this);
    this.update = this.update.bind(this);
    this.init();
  }

  get elem() {
    return this.categoryList;
  }

  init() {
    const {
      categoryList,
      handleClick,
      store,
      update
    } = this;

    categoryList.classList.add('categories');
    categoryList.onclick = handleClick;

    const { admin } = this.store.getState();
    const { category } = admin;

    this.setState({ category });
    this.render();

    store.subscribe(update);
  }

  setState(newState) {
    this.state = newState;
  }

  update() {
    const { admin } = this.store.getState();
    const { category } = admin;
    if (this.state.category === category) return;

    [...this.categoryList.children].forEach(c => {
      c.classList.toggle('active', c.id === category);
    });

    this.setState({ category });
  }

  handleClick({ target }) {
    if (!target.matches('.category a')) return;

    const selectedCategory = target.parentNode.id;
    if (this.state.category === selectedCategory) return;

    this.categoryList.scrollIntoView({ behavior: 'smooth' });
    this.store.dispatch(toggleNav(selectedCategory));
  }

  render() {
    const {
      categoryList,
      categories,
      store
    } = this;

    const { admin } = store.getState();
    const { category } = admin;

    categoryList.innerHTML = categories.map(c => (
      `<li id="${c}" class="category neon ${c === category ? 'active' : ''}">
        <a role="button">${c.toUpperCase()}</a>
      </li>`
    )).join('');
  }
}
