import { debounce } from 'lodash';

export default class Options {
  constructor(store, prevModal) {
    this.store = store;
    this.state = {};
    this.container = document.createElement('div');
    this.prevModal = prevModal;
    this.handleClick = this.handleClick.bind(this);
    this.editOption = debounce(this.editOption.bind(this), 300);
    this.editAnswer = this.editAnswer.bind(this);
    this.update = this.update.bind(this);
    this.init();
  }

  init() {
    const {
      store,
      container,
      update
    } = this;

    container.classList.add('options-container');
    store.subscribe(update);
  }

  update() {
    const {
      store,
      prevModal,
      container,
      handleClick,
      editOption,
      editAnswer
    } = this;

    // modal의 참조가 이전과 동일하면 종료
    const { modal } = store.getState();
    if (prevModal === modal) return;

    // modal 참조 업데이트
    this.prevModal = modal;

    // modal이 꺼지면 이벤트 핸들러 제거
    if (!modal.on) {
      container.onclick = null;
      container.onkeyup = null;
      container.onpaste = null;
      container.onchange = null;
      return;
    }

    // modal이 켜지면 이벤트 핸들러 등록
    container.onkeyup = editOption;
    container.onpaste = editOption;
    container.onclick = handleClick;
    container.onchange = editAnswer;

    // state를 default 상태로 설정 후 render
    const {
      id,
      options,
      answer,
      hasMultipleAnswers
    } = modal.quiz;

    this.setState({
      id,
      options,
      answer,
      hasMultipleAnswers
    });

    this.render();
  }

  setState(newState) {
    this.state = newState;
  }

  handleClick({ target }) {
    if (target.matches('.add-option-btn')) this.addOption();
    else if (target.matches('.rm-option-btn')) this.removeOption(target);
  }

  addOption() {
    const {
      id,
      options,
      hasMultipleAnswers
    } = this.state;

    // 1. 선택지 5개 이하 유지
    const optionKeys = Object.keys(options).sort();
    if (optionKeys.length >= 5) return;

    // 2. 추가할 선택지의 key를 생성하여 state.options에 추가
    // keyCode 생성시 a ~ e까지 순차적으로.
    let newKey = 'b'; // default newKey
    for (let i = 0; i < optionKeys.length - 1; i++) {
      const cur = optionKeys[i].charCodeAt(0);
      const next = optionKeys[i + 1].charCodeAt(0);
      if (next - cur > 1) {
        newKey = String.fromCharCode(cur + 1);
        break;
      }
      newKey = String.fromCharCode(next + 1);
    }

    this.setState({
      ...this.state,
      options: {
        ...this.state.options,
        [newKey]: ''
      }
    });

    // 선택지가 몇개인지 기록
    const keyCount = optionKeys.length + 1;

    // 3. 선택지 요소를 생성
    const newOption = document.createElement('li');
    newOption.classList.add('option');
    newOption.innerHTML = `<div class="option-wrapper">
      <input
        type="${hasMultipleAnswers ? 'checkbox' : 'radio'}"
        ${hasMultipleAnswers ? '' : `name=${id}-options`}
        value="${newKey}"
      />
      <input
        id="option-${newKey}"
        class="option-text"
        type="text"
      />
      <button id="rm-${newKey}" class="rm-option-btn">-</button>
    </div>`;

    // 4. 선택지 요소를 DOM에 추가
    const optionList = document.querySelector('.options');
    optionList.appendChild(newOption);

    // 5. 선택지가 2개일 때 allow multiple answers
    if (keyCount === 2) {
      document.getElementById('ck-multipleAns').disabled = false;
    }
  }

  removeOption(target) {
    const {
      id,
      options,
      answer,
      hasMultipleAnswers
    } = this.state;

    // 1. 선택지 1개 이상 유지
    const optionKeys = Object.keys(options).sort();
    if (optionKeys.length <= 1) return;

    // 2. 삭제할 선택지의 key를 state.options에서 제거
    const [, targetKey] = target.id.split('-');
    delete options[targetKey];
    this.setState({
      ...this.state,
      options
    });

    // 선택지가 몇개인지 기록
    const keyCount = optionKeys.length - 1;

    // 3. 선택지가 1개일 때, 정답은 1개
    if (keyCount === 1) {
      // 3.1. multiple answers 체크 박스 사용 중지
      const ckMultipleAns = document.getElementById('ck-multipleAns');
      ckMultipleAns.checked = false;
      ckMultipleAns.disabled = true;

      // 3.2. 정답 기본값으로 설정
      this.setState({
        ...this.state,
        answer: 'a',
        hasMultipleAnswers: false
      });

      // 3.3. 기본 선택지 생성
      const defaultOption = `<li class="option">
        <div class="option-wrapper">
          <input
            type="radio"
            name=${id}-options
            value="a"
            checked
          />
          <input 
            id="option-a"
            class="option-text"
            type="text"
            value="${options.a}"
          />
        </div>
      </li>`;

      // 3.4. 기본 선택지로 교체
      document.querySelector('.options').innerHTML = defaultOption;
    } else { // 4. 선택지가 2개 이상 남아있으면
      // 4.1. 삭제할 선택지 요소를 DOM에서 제거
      const targetNode = target.parentNode.parentNode;
      document.querySelector('.options').removeChild(targetNode);

      // 4.2. 삭제한 선택지가 정답이었다면
      if (answer === targetKey || answer.includes(targetKey)) {
        // 4.2.1. if multiple answers
        if (hasMultipleAnswers) {
          const newAnswer = answer.filter(a => a !== targetKey);
          this.setState({
            ...this.state,
            answer: newAnswer
          });
        } else { // 4.2.1. if single answer
          this.setState({
            ...this.state,
            answer: 'a'
          });
          document.querySelector('input[value="a"]').checked = true;
        }
      }
    }
  }

  editOption({ target, clipboardData }) {
    if (!target.matches('.option-text')) return;
    const [, key] = target.id.split('-');
    const value = clipboardData
      ? clipboardData.getData('text')
      : target.value;

    this.setState({
      ...this.state,
      options: {
        ...this.state.options,
        [key]: value
      }
    });
  }

  editAnswer({ target }) {
    const { type, value, checked } = target;

    // check multiple answers
    if (target.id === 'ck-multipleAns') {
      this.setState({
        ...this.state,
        answer: checked
          ? [this.state.answer]
          : this.state.answer.length
            ? this.state.answer[0]
            : 'a',
        hasMultipleAnswers: checked
      });

      const { id, answer, options } = this.state;
      const newOptions = Object.keys(options)
        .sort()
        .map((key, idx) => `<li class="option">
          <div class="option-wrapper">
            <input
              type="${checked ? 'checkbox' : 'radio'}"
              ${checked ? '' : `name=${id}-options`} 
              value="${key}"
              ${answer.includes(key) ? 'checked' : ''}
              ${checked
                ? answer.includes(key)
                  ? 'checked' : ''
                : answer === key
                  ? 'checked' : ''}
            />
            <input 
              id="option-${key}"
              class="option-text"
              type="text"
              value="${options[key]}"
            />
            ${idx >= 1 
              ? `<button id="rm-${key}" class="rm-option-btn">-</button>`
              : ''}
          </div>
        </li>`)
        .join('');

      document.querySelector('.options').innerHTML = newOptions;
      return;
    }

    // single answer
    if (type === 'radio') {
      this.setState({
        ...this.state,
        answer: value
      });
    } else if (type === 'checkbox') { // multiple answer
      const { answer } = this.state;
      this.setState({
        ...this.state,
        answer: checked ? [...answer, value] : answer.filter(a => a !== value)
      });
    }
  }

  render() {
    const { container, state } = this;
    const {
      id,
      options,
      answer,
      hasMultipleAnswers
    } = state;

    const optionKeys = Object.keys(options).sort();

    container.innerHTML = `<ul class="options">
      ${optionKeys.map((k, idx) => `<li class="option">
          <div class="option-wrapper">
            <input
              type="${hasMultipleAnswers ? 'checkbox' : 'radio'}"
              ${hasMultipleAnswers ? '' : `name=${id}-options`} 
              value="${k}"
              ${answer.includes(k) ? 'checked' : ''}
              ${hasMultipleAnswers
                ? answer.includes(k)
                  ? 'checked' : ''
                : answer === k
                  ? 'checked' : ''}
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
      <button class="add-option-btn">+</button>
      <label for="ck-multipleAns">Multiple Answers
        <input
          id="ck-multipleAns"
          type="checkbox"
          ${hasMultipleAnswers ? 'checked' : ''}
          ${optionKeys.length > 1 ? '' : 'disabled'}
        />
      </label>`;
  }
}
