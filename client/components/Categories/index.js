import './style.scss';
import { toggleNav } from '../../redux/actions';

export default class Categories {
  constructor(props) {
    this.props = props;
    this.state = {};
    this.categories = document.createElement('ul');
    this.update = this.update.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.init();
  }

  get elem() {
    return this.categories;
  }

  init() {
    this.categories.classList.add('categories');
    this.categories.onclick = this.handleClick;
    const { category } = this.props.store.getState();
    this.setState({ category });
    this.props.store.subscribe(this.update);
    this.render();
  }

  setState(newState) {
    this.state = newState;
  }

  update() {
    const { category, quizForm } = this.props.store.getState();
    if (this.state.category === category) return;

    [...this.categories.children].forEach(c => {
      c.classList.toggle('active', c.id === category);
    });

    if (quizForm.type !== 'EDIT') {
      this.categories.scrollIntoView({
        behavior: 'smooth'
      });
    }

    this.setState({ category });
  }

  handleClick({ target }) {
    if (!target.matches('.category a')) return;
    const selectedCategory = target.parentNode;
    this.props.store.dispatch(toggleNav(selectedCategory.id));
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
