import './styles/modal.module.scss';
import { setModal, addQuiz, editQuiz } from '../redux/actions';
import QuizService from '../services/QuizServices';

export default class Modal {
  constructor(store) {
    this.state = {};
    this.store = store;
    this.currentModalState = store.getState().modal;

    this.container = document.createElement('div');
    this.form = document.createElement('form');
    this.heading = document.createElement('legend');
    this.questionWrapper = document.createElement('div');
    this.setting = document.createElement('div');
    this.panes = document.createElement('ul');
    this.textarea = document.createElement('textarea');
    this.optionsWrapper = document.createElement('div');
    this.btnGroup = document.createElement('div');
    this.exitBtn = document.createElement('button');

    this.init();
  }

  init() {
    this.container.classList.add('modal');
    this.form.classList.add('quiz-form');
    this.container.appendChild(this.form);

    // subscribe
    this.store.subscribe(this.update.bind(this));

    // handler binding

    // ignore form submit
    this.form.onsubmit = e => {
      e.preventDefault();
    };

    // set question
    this.questionWrapper.onkeyup = ({ target }) => {
      if (!target.matches('#question')) return;
      this.setState('question', target.value);
      console.log(`question = ${target.value}`);
    };

    this.questionWrapper.onpaste = ({ target, clipboardData }) => {
      if (!target.matches('#question')) return;
      const value = clipboardData.getData('text');
      this.setState('question', value);
      console.log(`question = ${value}`);
    };

    // set category, point, second
    this.setting.onchange = ({ target }) => {
      const key = target.id === 'categories'
        ? 'category'
        : target.id === 'points'
          ? 'point'
          : 'second';

      const value = key === 'category'
        ? target.value
        : +target.value;

      this.setState(key, value);
      console.log(`${key} = ${target.value}`);
    };

    this.panes.onchange = ({ target }) => {
      document.querySelector('.panes .active').classList.remove('active');
      target.parentNode.classList.add('active');

      this.setState('hasCode', target.id === 'code-pane');
      console.log(`set hasCode = ${target.id === 'code-pane'}`);
    };

    // set content
    this.textarea.onkeyup = ({ target }) => {
      this.setState('content', target.value);
      console.log(`content = ${target.value}`);
    };

    this.textarea.onpaste = ({ clipboardData }) => {
      const value = clipboardData.getData('text');
      this.setState('content', value);
      console.log(`content = ${value}`);
    };

    // set options
    this.optionsWrapper.onchange = ({ target }) => {
      if (!(target.type === 'radio')) return;
      this.setState('answer', target.value);
      console.log(`answer = ${target.value}`);
    };

    this.optionsWrapper.onkeyup = ({ target }) => {
      if (!(target.type === 'text')) return;
      const [, key] = target.id.split('-');
      this.state.options[key] = target.value;
      console.log('options = ', this.state.options);
    };

    this.optionsWrapper.onpaste = ({ target, clipboardData }) => {
      const [, key] = target.id.split('-');
      const value = clipboardData.getData('text');
      this.state.options[key] = value;
      console.log('options = ', this.state.options);
    };

    this.optionsWrapper.onclick = ({ target }) => {
      if (target.matches('.add-option-btn')) {
        const optionKeys = Object.keys(this.state.options).sort();
        if (optionKeys.length >= 5) return;

        const nextKeyCode = optionKeys[optionKeys.length - 1].charCodeAt(0) + 1;
        const nextKey = String.fromCharCode(nextKeyCode); // b, c, d, e
        this.state.options[nextKey] = '';
        console.log(this.state.options);

        const newOption = document.createElement('li');
        newOption.classList.add('option');
        newOption.innerHTML = `<div class="option-wrapper">
          <input
            type="radio"
            name="${this.state.id}-options"
            value="${nextKey}"
            ${nextKey === this.state.answer ? 'checked' : ''}
          />
          <input id="option-${nextKey}" type="text" />
          <button id="rm-${nextKey}" class="rm-option-btn">-</button>
        </div>`;

        document.querySelector('.options').appendChild(newOption);
      } else if (target.matches('.rm-option-btn')) {
        if (Object.keys(this.state.options).length <= 1) return;

        const [, targetKey] = target.id.split('-');
        delete this.state.options[targetKey];
        console.log(this.state.options);

        const targetNode = target.parentNode.parentNode;
        document.querySelector('.options').removeChild(targetNode);
      }
    };

    // dispatch action ADD/EDIT/CLOSE
    this.btnGroup.onclick = async ({ target }) => {
      if (target.matches('.add')) {
        // validate state.question, options
        if (this.validateInput()) {
          // escape html entities
          const escapeHtmlEntities = str => (
            [...str].map(c => (c === '<'
              ? '&lt;'
              : c === '>'
                ? '&gt;'
                : c)).join('')
          );

          this.state.question = escapeHtmlEntities(this.state.question);

          if (!this.state.hasCode && this.state.content) {
            this.state.question = escapeHtmlEntities(this.state.question);
          }

          Object.keys(this.state.options).forEach(key => {
            this.state.options[key] = escapeHtmlEntities(this.state.options[key]);
          });

          // add/edit question
          const { modal } = this.store.getState();
          const res = modal.type === 'ADD'
            ? await QuizService.addQuiz(this.state)
            : await QuizService.editQuiz(this.state.id, this.state);

          const quiz = await res.json();
          this.store.dispatch(modal.type === 'ADD' ? addQuiz(quiz) : editQuiz(quiz));
          this.store.dispatch(setModal({
            type: '',
            on: false,
            id: null
          }));
        } else { // display error
          console.log('빈 칸을 채워주세요');
        }
      } else if (target.matches('.cancel')) {
        console.log('exit modal');
        this.store.dispatch(setModal({
          type: '',
          on: false,
          id: null
        }));
      }
    };

    this.exitBtn.onclick = () => {
      console.log('exit modal');
      this.store.dispatch(setModal({
        type: '',
        on: false,
        id: null
      }));
    };
  }

  setState(key, value) {
    this.state[key] = value;
  }

  validateInput() {
    let validated = true;
    if (!this.state.question.trim()) validated = false;
    Object.keys(this.state.options).forEach(k => {
      if (!this.state.options[k].trim()) validated = false;
    });

    return validated;
  }

  update() {
    // setModal에만 반응하게 걸러줘야한다.
    const { modal, quizzes } = this.store.getState();
    if (this.currentModalState === modal) return;

    this.currentModalState = modal;
    console.log('modal update');

    this.container.classList.toggle('active', modal.on);

    if (modal.type === 'ADD') {
      // initialize state
      this.state = {
        id: modal.id,
        category: 'html',
        point: 1000,
        second: 30,
        question: '',
        content: '',
        options: {
          a: ''
        },
        answer: 'a',
        hasCode: false,
        selected: false
      };
      // render
      this.render();
    } else if (modal.type === 'EDIT') {
      // initialize state with provided data(quiz)
      console.log(quizzes.find(({ id }) => id === modal.id));
      this.state = quizzes.find(({ id }) => id === modal.id);
      // render
      this.render();
    } else if (!modal.type) {
      // reset state
      console.log('reset state');
      this.state = {};
      this.form.removeChild(this.form.lastElementChild);
    }
  }

  render() {
    // classlist 위로 옮기기
    const {
      state,
      store,
      form,
      heading,
      questionWrapper,
      setting,
      panes,
      textarea,
      optionsWrapper,
      btnGroup,
      exitBtn
    } = this;

    console.log(state);

    const {
      id,
      category,
      point,
      second,
      question,
      content,
      options,
      answer,
      hasCode
    } = state;

    const {
      categories,
      points,
      seconds,
      modal
    } = store.getState();

    const fields = document.createElement('div');
    fields.setAttribute('role', 'group');
    fields.classList.add('fields');

    heading.textContent = `${modal.type} Quiz`;
    questionWrapper.classList.add('question-wrapper');
    questionWrapper.innerHTML = `
      <label for="question">Q${id}) </label>
      <input id="question" type="text" value="${question}"/>`;
    fields.appendChild(questionWrapper);

    setting.classList.add('setting');
    setting.innerHTML = `<label for="categories">카테고리</label>
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
    fields.appendChild(setting);

    panes.classList.add('panes', 'clearfix');
    panes.innerHTML = `<li class="pane ${hasCode ? '' : 'active'}">
        <label for="text-pane">text</label>
        <input id="text-pane" type="radio" name="panes" ${hasCode ? '' : 'checked'} />
      </li>
      <li class="pane ${hasCode ? 'active' : ''}">
        <label for="code-pane">code</label>
        <input id="code-pane" type="radio" name="panes" ${hasCode ? 'checked' : ''}/>
      </li>`;
    fields.appendChild(panes);

    textarea.classList.add('content');
    textarea.value = content;
    fields.appendChild(textarea);

    optionsWrapper.classList.add('options-wrapper');
    optionsWrapper.innerHTML = `<ul class="options">
      ${Object.keys(options).sort().map(k => `<li class="option">
          <div class="option-wrapper">
            <input type="radio" name="${id}-options" ${k === answer ? 'checked' : ''} value="${k}"/>
            <input id="option-${k}" type="text" value="${options[k]}" />
          </div>
        </li>`).join('')}
      </ul>
      <button class="add-option-btn">+</button>`;
    fields.appendChild(optionsWrapper);

    btnGroup.classList.add('btn-group');
    btnGroup.innerHTML = `<button class="modal-btn add">${modal.type}</button>
      <button class="modal-btn cancel">CANCEL</button>`;
    fields.appendChild(btnGroup);

    exitBtn.classList.add('exit-btn');
    exitBtn.textContent = 'X';
    fields.appendChild(exitBtn);

    form.appendChild(fields);
  }
}
