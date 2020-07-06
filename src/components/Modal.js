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
    this.legend = document.createElement('legend');
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
      legend,
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

    // assgin class & attributes
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

    // append child to fields
    const fieldElements = [
      legend,
      questionWrapper,
      setting,
      panes,
      textarea,
      optionsWrapper,
      btnGroup,
      exitBtn
    ];

    fieldElements.forEach(elem => fields.appendChild(elem));
    console.log(fields);

    // add form in container
    container.appendChild(form);
    console.log(container);

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
    // allowMultipleAnswers, answer[type="checkbox"], answer[type="radio"]
    const editAnswer = ({ target }) => {
      if (target.type === 'radio') {
        this.setState('answer', target.value);
        console.log('answer = ', this.state.answer);
      } else if (target.type === 'checkbox') {
        const { answer } = this.state;
        this.setState('answer', target.checked
          ? [...answer, target.value]
          : answer.filter(a => a !== target.value));
        console.log('answer = ', this.state.answer);
      }
    };

    // set options[key]
    const editOption = ({ target, clipboardData }) => {
      if (!target.matches('.option-text')) return;
      const [, key] = target.id.split('-');
      const value = clipboardData
        ? clipboardData.getData('text')
        : target.value;

      this.state.options[key] = value;
      console.log('options = ', this.state.options);
    };

    // add/remove option
    const addOption = () => {
      const {
        id,
        options,
        hasMultipleAnswers
      } = this.state;

      let optionKeys = Object.keys(options).sort();
      if (optionKeys.length >= 5) return; // 선택지 5개 이하 유지

      // 선택지 key를 생성하여 state.options에 추가
      // keyCode 생성시 a ~ z까지 순차적으로. z 이상은 다시 a로 수정
      const nextKeyCode = optionKeys[optionKeys.length - 1].charCodeAt(0) + 1;
      const nextKey = String.fromCharCode(nextKeyCode);
      optionKeys = [...optionKeys, nextKey];

      this.setState('options', {
        ...this.state.options,
        [nextKey]: ''
      });
      console.log(this.state.options);

      // 선택지 요소를 생성
      const newOption = document.createElement('li');
      newOption.classList.add('option');
      newOption.innerHTML = `<div class="option-wrapper">
        <input
          type="${hasMultipleAnswers ? 'checkbox' : 'radio'}"
          ${hasMultipleAnswers ? '' : `name=${id}-options`}
          value="${nextKey}"
        />
        <input
          id="option-${nextKey}"
          class="option-text"
          type="text"
        />
        <button id="rm-${nextKey}" class="rm-option-btn">-</button>
      </div>`;

      // 선택지 요소를 DOM에 추가
      const $options = document.querySelector('.options');
      $options.appendChild(newOption);

      // 선택지 2개 이상부터 정답 2개 이상 가능
      if (optionKeys.length === 2) {
        // 그냥 추가해놓고 disabled에서 able로 바꾸자
        optionsWrapper.appendChild(allowMultipleAnswers);
      }
    };

    const removeOption = target => {
      const {
        id,
        options,
        answer,
        hasMultipleAnswers
      } = this.state;

      // 선택지 1개 이상 유지
      let optionKeys = Object.keys(options);
      if (optionKeys.length <= 1) return;

      // 삭제할 선택지 key를 state.options에서 제거
      const [, targetKey] = target.id.split('-');
      optionKeys = optionKeys.filter(key => key !== targetKey);
      delete options[targetKey];
      this.setState('options', {
        ...options
      });
      console.log(this.state.options);

      // 삭제한 선택지가 정답이었다면 answer에서 제거
      if (hasMultipleAnswers) {
        if (answer.includes(targetKey)) {
          // console.log('answer changed');
          const newAnswer = answer.filter(a => a !== targetKey);
          if (!newAnswer.length) {
            newAnswer.push('a');
            // 체크박스 체크
          }
          this.setState('answer', newAnswer);
          console.log(this.state.answer);
        }
      } else {
        if (answer === targetKey) {
          // console.log('answer changed')
          this.setState('answer', 'a');
          // 라디오버튼 체크
          console.log(this.state.answer);
        }
      }

      // 삭제할 선택지 요소를 포함하는 부모 요소를 DOM에서 제거
      const targetNode = target.parentNode.parentNode;
      const $options = document.querySelector('.options');
      $options.removeChild(targetNode);

      // 선택지가 1개로 줄었을 때, 정답은 무조건 1개
      if (optionKeys.length === 1) {
        allowMultipleAnswers.checked = false;
        optionsWrapper.removeChild(allowMultipleAnswers); // diable로 바꾸자

        // 선택지가 1개로 줄기 전, 2개 이상의 정답을 허용했다면
        if (hasMultipleAnswers) {
          this.setState('answer', 'a');
          this.setState('hasMultipleAnswers', false);

          // 기본 선택지 생성
          const defaultOption = `<li class="option">
              <div class="option-wrapper">
                <input
                  type="radio"
                  name=${id}-options
                  value="${this.state.answer}"
                  checked
                />
                <input 
                  id="option-${this.state.answer}"
                  class="option-text"
                  type="text"
                  value="${this.state.options[this.state.answer]}"
                />
              </div>
            </li>`;

          // 기본 선택지로 교체
          $options.innerHTML = defaultOption;
        }
      }
    };

    const handleClick = ({ target }) => {
      if (target.matches('.add-option-btn')) addOption();
      else if (target.matches('.rm-option-btn')) removeOption(target);
    };

    optionsWrapper.addEventListener('change', editAnswer);
    optionsWrapper.addEventListener('keyup', editOption);
    optionsWrapper.addEventListener('paste', editOption);
    optionsWrapper.addEventListener('click', handleClick);

    // 7. hasMultipleAnswers
    const toggleMultipleAnswers = e => {
      e.stopPropagation();
      const selected = e.target.checked;

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
            <input 
              id="option-${key}"
              class="option-text"
              type="text"
              value="${this.state.options[key]}"
            />
            ${idx >= 1 ? `<button id="rm-${key}" class="rm-option-btn">-</button>` : ''}
          </div>
        </li>`)
        .join('');

      const options = document.querySelector('.options');
      options.innerHTML = newOptions;
    };

    allowMultipleAnswers.addEventListener('change', toggleMultipleAnswers);

    // 8. add/edit quiz
    // 8.1. close modal
    const exitModal = () => {
      this.allowMultipleAnswers.checked = false;
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
      legend,
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

    legend.textContent = `${modal.type} Quiz`;

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
            <input
              id="option-${k}"
              class="option-text"
              type="text"
              value="${options[k]}"
            />
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
