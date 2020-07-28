import './style.scss';
import { toggleNav } from '../../redux/modules/admin';
import { getStore } from '../../redux/store';

export default class Categories {
  constructor({ type, categoryList }) {
    this.type = type;
    this.categoryList = categoryList;
    this.store = getStore();
    this.state = {};
    this.categories = document.createElement('ul');
    this.handleClick = this.handleClick.bind(this);
    this.update = this.update.bind(this);
    this.init();
  }

  init() {
    const {
      categories,
      handleClick,
      store,
      update
    } = this;

    categories.classList.add('categories');
    categories.onclick = handleClick;

    const { admin } = this.store.getState();
    const { category } = admin;

    this.setState({ category });
    store.subscribe(update);
  }

  setState(newState) {
    this.state = newState;
  }

  update() {
    const { admin } = this.store.getState();
    const { category } = admin;
    if (this.state.category === category) return;

    [...this.categories.children].forEach(c => {
      c.classList.toggle('active', c.id === category);
    });

    this.setState({ category });
  }

  handleClick({ target }) {
    if (!target.matches('.category a')) return;

    const selectedCategory = target.parentNode.id;
    if (this.state.category === selectedCategory) return;

    this.categories.scrollIntoView({ behavior: 'smooth' });
    this.store.dispatch(toggleNav(selectedCategory));
  }

  render() {
    const {
      categories,
      categoryList,
      store
    } = this;

    const { admin } = store.getState();
    const { category } = admin;

    categories.innerHTML = categoryList.map(c => (
      `<li id="${c}" class="category neon ${c === category ? 'active' : ''}">
        <a role="button">${c.toUpperCase()}</a>
      </li>`
    )).join('');

    return categories;
  }
}
