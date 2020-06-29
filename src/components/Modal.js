import './styles/modal.module.scss';

export default class Modal {
  constructor(store) {
    this.store = store;
    this.container = document.createElement('div');
    this.form = document.createElement('form');
    this.init();
  }

  init() {
    const { container, form, store } = this;
    const { categories, points, seconds } = store.getState();
    container.classList.add('overlay');
    form.classList.add('quiz-form');
    form.innerHTML = `<fieldset class="fields">
      <legend>ADD Quiz</legend>
      <label class="quiz-title">title<input type="text" /></label>
      <div class="setting">
        <label for="categories">카테고리</label>
        <select id="categories">
          ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
        <label for="points">포인트</label>
        <select id="points">
          ${points.map(p => `<option value="${p}">${p}</option>`).join('')}
        </select>
        <label for="seconds">시간(초)</label>
        <select id="seconds">
          ${seconds.map(s => `<option value="${s}">${s}</option>`).join('')}
        </select>
      </div>
      <ul class="tabs clearfix">
        <li class="tab active"><label for="text">text</label></li>
        <li class="tab"><label for="code">code</label></li>
      </ul>
      <textarea id="text" class="text"></textarea>
      <textarea id="code" class="code"></textarea>
    </fieldset>`;

    container.appendChild(form);
  }
}
