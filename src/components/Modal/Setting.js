export default class Setting {
  constructor(store, prevModal) {
    this.store = store;
    this.state = {};
    this.prevModal = prevModal;
    this.categories = ['html', 'css', 'javascript'];
    this.points = [1000, 2500, 5000, 10000];
    this.seconds = [30, 45, 60, 90];
    this.container = document.createElement('div');
    this.handleChange = this.handleChange.bind(this);
    this.update = this.update.bind(this);
    this.init();
  }

  init() {
    const {
      store,
      container,
      update
    } = this;

    container.classList.add('setting');
    store.subscribe(update);
  }

  update() {
    const {
      store,
      prevModal,
      container,
      handleChange
    } = this;

    // modal의 참조가 이전과 동일하면 종료
    const { modal } = store.getState();
    if (prevModal === modal) return;

    // modal이 꺼지면 이벤트 핸들러 제거
    if (!modal.on) {
      container.onchange = null;
      return;
    }

    // modal이 켜지면 이벤트 핸들러 등록
    container.onchange = handleChange;

    // state를 default 상태로 설정 후 render
    const {
      category,
      point,
      second
    } = modal.quiz;

    this.setState({
      category,
      point,
      second
    });
    this.render();

    // modal 참조 업데이트
    this.prevModal = modal;
  }

  setState(newState) {
    this.state = newState;
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

    this.setState({
      ...this.state,
      [key]: value
    });
  }

  render() {
    const {
      state,
      categories,
      points,
      seconds,
      container
    } = this;

    const {
      category,
      point,
      second
    } = state;

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
