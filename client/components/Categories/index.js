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
    if (!target.matches('.category a')) return;

    const prevSelectedCategory = document.querySelector('.categories .active');
    const selectedCategory = target.parentNode;

    if (prevSelectedCategory === selectedCategory) return;

    prevSelectedCategory.classList.remove('active');
    selectedCategory.classList.add('active');

    const { categories, props } = this;

    props.store.dispatch(toggleNav(selectedCategory.id));

    categories.scrollIntoView({
      behavior: 'smooth'
    });
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
