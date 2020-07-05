import './styles/modal.module.scss';
import he from 'he';
import { setModal, addQuiz, editQuiz, setError } from '../redux/actions';
import QuizService from '../services/QuizService';

export default class Modal {
  constructor(store) {
    this.state = {};
    this.store = store;
    this.currentModalState = store.getState().modal;

    this.container = document.createElement('div');
    this.form = document.createElement('form');
    this.fields = document.createElement('div');
    this.heading = document.createElement('legend');
    this.questionWrapper = document.createElement('div');
    this.setting = document.createElement('div');
    this.panes = document.createElement('ul');
    this.textarea = document.createElement('textarea');
    this.optionsWrapper = document.createElement('div');
    this.allowMultipleAnswers = document.createElement('input');
    this.btnGroup = document.createElement('div');
    this.exitBtn = document.createElement('button');

    this.init();
  }

  init() {
    const {
      container,
      form,
      fields,
      heading,
      questionWrapper,
      setting,
      panes,
      textarea,
      optionsWrapper,
      allowMultipleAnswers,
      btnGroup,
      exitBtn,
      store,
      update
    } = this;

    // class & attributes setting
    container.classList.add('modal');
    form.classList.add('quiz-form');
    fields.classList.add('fields');
    fields.setAttribute('role', 'group');
    questionWrapper.classList.add('question-wrapper');
    setting.classList.add('setting');
    panes.classList.add('panes', 'clearfix');
    textarea.classList.add('content');
    optionsWrapper.classList.add('options-wrapper');
    allowMultipleAnswers.setAttribute('type', 'checkbox');
    allowMultipleAnswers.setAttribute('id', 'ck-multipleAns');
    btnGroup.classList.add('btn-group');
    exitBtn.classList.add('exit-btn');

    // add child in fields
    const children = [
      heading,
      questionWrapper,
      setting,
      panes,
      textarea,
      optionsWrapper,
      btnGroup,
      exitBtn
    ];

    children.forEach(node => fields.appendChild(node));

    // add form in container
    container.appendChild(form);

    // subscribe
    store.subscribe(update.bind(this));

    // handler binding
    // 1. ignore form submit
    const ignoreSubmit = e => {
      e.preventDefault();
    };

    form.addEventListener('submit', ignoreSubmit);

    // 2. set question
    const editQuestion = ({ target, clipboardData }) => {
      if (!target.matches('#question')) return;

      const value = clipboardData
        ? clipboardData.getData('text')
        : target.value;

      this.setState('question', value);
      console.log(`question = ${value}`);
    };

    questionWrapper.addEventListener('keyup', editQuestion);
    questionWrapper.addEventListener('paste', editQuestion);

    // 3. set category, point, second
    const editSetting = ({ target }) => {
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

    setting.addEventListener('change', editSetting);

    // 4. set hasCode
    const togglePane = ({ target }) => {
      const prevPane = document.querySelector('.panes .active');
      const currentPane = target.parentNode;
      if (prevPane === currentPane) return;

      prevPane.classList.remove('active');
      currentPane.classList.add('active');

      this.setState('hasCode', target.id === 'code-pane');
      console.log(`set hasCode = ${target.id === 'code-pane'}`);
    };

    panes.addEventListener('change', togglePane);

    // 5. set content
    const editContent = ({ target, clipboardData }) => {
      const value = clipboardData
        ? clipboardData.getData('text')
        : target.value;

      this.setState('content', value);
      console.log(`content = ${value}`);
    };

    textarea.addEventListener('keyup', editContent);
    textarea.addEventListener('paste', editContent);

    // 6. set options
    optionsWrapper.onchange = ({ target }) => {
      if (target.id === 'ck-multipleAns') return;
      if (target.type === 'radio') {
        this.setState('answer', target.value);
      } else if (target.type === 'checkbox') {
        this.setState('answer', target.checked ? [...this.state.answer, target.value] : this.state.answer.filter(a => a !== target.value));
      }

      console.log('answer = ', this.state.answer);
    };

    optionsWrapper.onkeyup = ({ target }) => {
      if (!(target.type === 'text')) return;
      const [, key] = target.id.split('-');
      this.state.options[key] = target.value;
      console.log('options = ', this.state.options);
    };

    optionsWrapper.onpaste = ({ target, clipboardData }) => {
      const [, key] = target.id.split('-');
      const value = clipboardData.getData('text');
      this.state.options[key] = value;
      console.log('options = ', this.state.options);
    };

    // hasMultipleAnswers
    allowMultipleAnswers.onchange = ({ target }) => {
      const selected = target.checked;

      this.state.answer = selected ? [this.state.answer] : 'a';
      this.state.hasMultipleAnswers = selected;

      const newOptions = Object.keys(this.state.options)
        .sort()
        .map((key, idx) => `<li class="option">
          <div class="option-wrapper">
            <input
              type="${selected ? 'checkbox' : 'radio'}"
              ${selected ? '' : `name=${this.state.id}-options`} 
              value="${key}"
              ${this.state.answer.includes(key) ? 'checked' : ''}
              ${selected
                ? this.state.answer.includes(key)
                  ? 'checked'
                  : ''
                : this.state.answer === key
                  ? 'checked'
                  : ''}
            />
            <input id="option-${key}" type="text" value="${this.state.options[key]}"/>
            ${idx >= 1
              ? `<button id="rm-${key}" class="rm-option-btn">-</button>`
              : ''}
          </div>
        </li>`)
        .join('');

      document.querySelector('.options').innerHTML = newOptions;
    };

    optionsWrapper.onclick = ({ target }) => {
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
            type="${this.state.hasMultipleAnswers ? 'checkbox' : 'radio'}"
            ${this.state.hasMultipleAnswers ? '' : `name=${this.state.id}-options`}
            value="${nextKey}"
          />
          <input id="option-${nextKey}" type="text" />
          <button id="rm-${nextKey}" class="rm-option-btn">-</button>
        </div>`;

        document.querySelector('.options').appendChild(newOption);
        if (Object.keys(this.state.options).length === 2) {
          optionsWrapper.appendChild(allowMultipleAnswers);
        }
      } else if (target.matches('.rm-option-btn')) {
        if (Object.keys(this.state.options).length <= 1) return;

        const [, targetKey] = target.id.split('-');
        delete this.state.options[targetKey];
        console.log(this.state.options);

        const targetNode = target.parentNode.parentNode;
        document.querySelector('.options').removeChild(targetNode);
        if (Object.keys(this.state.options).length === 1) {
          allowMultipleAnswers.checked = false;
          // 중복
          const selected = false;
          this.state.answer = selected ? [this.state.answer] : 'a';
          this.state.hasMultipleAnswers = selected;

          const newOptions = Object.keys(this.state.options)
            .sort()
            .map((key, idx) => `<li class="option">
              <div class="option-wrapper">
                <input
                  type="${selected ? 'checkbox' : 'radio'}"
                  ${selected ? '' : `name=${this.state.id}-options`} 
                  value="${key}"
                  ${this.state.answer.includes(key) ? 'checked' : ''}
                  ${selected
                    ? this.state.answer.includes(key)
                      ? 'checked'
                      : ''
                    : this.state.answer === key
                      ? 'checked'
                      : ''}
                />
                <input id="option-${key}" type="text" value="${this.state.options[key]}"/>
                ${idx >= 1
                  ? `<button id="rm-${key}" class="rm-option-btn">-</button>`
                  : ''}
              </div>
            </li>`)
            .join('');

          document.querySelector('.options').innerHTML = newOptions;
          optionsWrapper.removeChild(allowMultipleAnswers);
        }
      }
    };

    // 7. add/edit quiz
    // 7.1. close modal
    const exitModal = () => {
      this.form.removeChild(this.form.lastElementChild);
      this.store.dispatch(setModal({
        type: '',
        on: false,
        id: null
      }));
      console.log('exit modal');
    };

    const escapeHtml = () => {
      this.state.question = he.escape(this.state.question);

      if (!this.state.hasCode && this.state.content) {
        this.state.content = he.escape(this.state.content);
      }

      Object.keys(this.state.options).forEach(key => {
        this.state.options[key] = he.escape(this.state.options[key]);
      });
    };

    const validateInput = () => {
      const err = new Error();
      err.type = 'validation';
      err.message = '입력 값이 잘못되었습니다.';

      if (!this.state.question.trim()) throw err;

      Object.keys(this.state.options).forEach(k => {
        if (!this.state.options[k].trim()) throw err;
      });
    };

    const handleSubmit = async ({ target }) => {
      if (target.matches('.add')) {
        try {
          // validate state.question, options
          validateInput();

          // escape html entities
          escapeHtml();

          // add/edit question
          const { modal } = this.store.getState();
          const res = modal.type === 'ADD'
            ? await QuizService.addQuiz(this.state)
            : await QuizService.editQuiz(this.state.id, this.state);

          const quiz = await res.json();
          this.store.dispatch(modal.type === 'ADD' ? addQuiz(quiz) : editQuiz(quiz));
          exitModal();
        } catch (err) {
          this.store.dispatch(setError(err));
          console.error(err);
        }
      } else if (target.matches('.cancel')) {
        exitModal();
      }
    };

    btnGroup.addEventListener('click', handleSubmit);
    exitBtn.addEventListener('click', exitModal);
  }

  setState(key, value) {
    this.state[key] = value;
  }

  update() {
    const {
      store,
      currentModalState
    } = this;

    const { modal, quizzes } = store.getState();
    if (currentModalState === modal) return;

    this.currentModalState = modal;
    this.container.classList.toggle('active', modal.on);

    if (modal.type === 'ADD') {
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
        hasMultipleAnswers: false,
        answer: 'a',
        hasCode: false,
        selected: false
      };
      this.render();
    } else if (modal.type === 'EDIT') {
      this.state = quizzes.find(({ id }) => id === modal.id);
      this.render();
    } else if (!modal.type) {
      this.state = {};
    }
  }

  // hasMultipleAnswers
  render() {
    const {
      state,
      store,
      form,
      fields,
      heading,
      questionWrapper,
      setting,
      panes,
      textarea,
      optionsWrapper,
      allowMultipleAnswers,
      btnGroup,
      exitBtn
    } = this;

    const {
      id,
      category,
      point,
      second,
      question,
      content,
      options,
      hasMultipleAnswers,
      answer,
      hasCode
    } = state;

    const {
      categories,
      points,
      seconds,
      modal
    } = store.getState();

    heading.textContent = `${modal.type} Quiz`;

    questionWrapper.innerHTML = `
      <label for="question">Q${id}) </label>
      <input id="question" type="text" value="${question}"/>`;

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

    panes.innerHTML = `<li class="pane ${hasCode ? '' : 'active'}">
        <label for="text-pane">text</label>
        <input id="text-pane" type="radio" name="panes" ${hasCode ? '' : 'checked'} />
      </li>
      <li class="pane ${hasCode ? 'active' : ''}">
        <label for="code-pane">code</label>
        <input id="code-pane" type="radio" name="panes" ${hasCode ? 'checked' : ''}/>
      </li>`;

    textarea.value = content;

    optionsWrapper.innerHTML = `<ul class="options">
      ${Object.keys(options).sort().map((k, idx) => `<li class="option">
          <div class="option-wrapper">
            <input
              type="${hasMultipleAnswers ? 'checkbox' : 'radio'}"
              ${hasMultipleAnswers ? '' : `name=${id}-options`} 
              value="${k}"
              ${answer.includes(k) ? 'checked' : ''}
              ${hasMultipleAnswers
                ? answer.includes(k)
                  ? 'checked'
                  : ''
                : answer === k
                  ? 'checked'
                  : ''}
            />
            <input id="option-${k}" type="text" value="${options[k]}" />
            ${idx >= 1
              ? `<button id="rm-${k}" class="rm-option-btn">-</button>`
              : ''}
          </div>
        </li>`).join('')}
      </ul>
      <button class="add-option-btn">+</button>`;

    if (hasMultipleAnswers) {
      allowMultipleAnswers.checked = true;
      optionsWrapper.appendChild(allowMultipleAnswers);
    }

    btnGroup.innerHTML = `<button class="modal-btn add">${modal.type}</button>
      <button class="modal-btn cancel">CANCEL</button>`;

    exitBtn.textContent = 'X';

    form.appendChild(fields);
  }
}
