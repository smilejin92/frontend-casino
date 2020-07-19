import { setQuizFormData } from '../../redux/actions';

export default class Setting {
  constructor({
    store,
    categories,
    points,
    seconds
  }) {
    this.store = store;
    this.categories = categories;
    this.points = points;
    this.seconds = seconds;
    this.container = document.createElement('div');
    this.handleChange = this.handleChange.bind(this);
    this.init();
  }

  get elem() {
    return this.container;
  }

  init() {
    const { container, handleChange } = this;

    container.classList.add('setting');
    container.onchange = handleChange;
    this.render();
  }

  handleChange({ target }) {
    const key = target.id === 'categories'
      ? 'category'
      : target.id === 'points'
        ? 'point'
        : 'second';

    const value = key === 'category'
      ? target.value
      : +target.value;

    this.store.dispatch(setQuizFormData({ [key]: value }));
  }

  render() {
    const {
      categories,
      points,
      seconds,
      container,
      store
    } = this;

    const { quizForm } = store.getState();
    const {
      category,
      point,
      second
    } = quizForm.data;

    container.innerHTML = `<label for="categories">카테고리</label>
      <select id="categories">
        ${categories.map(c => `<option value="${c}" ${c === category ? 'selected' : ''}>${c}</option>`).join('')}
      </select>
      <label for="points">포인트</label>
      <select id="points">
        ${points.map(p => `<option value="${p}" ${p === point ? 'selected' : ''}>${p}</option>`).join('')}
      </select>
      <label for="seconds">시간(초)</label>
      <select id="seconds">
        ${seconds.map(s => `<option value="${s}" ${s === second ? 'selected' : ''}>${s}</option>`).join('')}
      </select>`;
  }
}
