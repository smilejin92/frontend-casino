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
    container.classList.add('modal');
    form.classList.add('quiz-form');

    const nextId = 10;

    form.innerHTML = `<div role="group" class="fields">
      <legend>ADD Quiz</legend>
      <div class="question">
        <label for="qs-text">문제</label>
        <input id="qs-text" type="text" />
      </div>
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
        <li class="tab">
          <label for="text-pane">text</label>
          <input id="text-pane" type="radio" name="panes" checked />
        </li>
        <li class="tab active">
          <label for="code-pane">code</label>
          <input id="code-pane" type="radio" name="panes" />
        </li>
      </ul>
      <textarea class="pane code"></textarea>
      <div class="choices-group">
        <ul class="choices">
          <li class="choice">
            <div class="choice-group">
              <input type="radio" name="${nextId}-choices" checked value="a"/>
              <input type="text" />
            </div>
          </li>
          <li class="choice">
            <div class="choice-group">
              <input type="radio" name="${nextId}-choices" value="b"/>
              <input type="text" />
            </div>
          </li>
          <li class="choice">
            <div class="choice-group">
              <input type="radio" name="${nextId}-choices" value="c"/>
              <input type="text" />
            </div>
          </li>
          <li class="choice">
            <div class="choice-group">
              <input type="radio" name="${nextId}-choices" value="d"/>
              <input type="text" />
            </div>
          </li>
        </ul>
        <button class="add-choice-btn">+</button>
      </div>
      <div class="btn-group">
        <button class="modal-btn">ADD</button>
        <button class="modal-btn">CANCEL</button>
      </div>
      <button class="exit-btn">X</button>
    </div>`;

    container.appendChild(form);
  }
}
