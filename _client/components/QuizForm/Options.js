import { debounce } from 'lodash';
import { setQuizFormData } from '../../redux/modules/admin';

export default class Options {
  constructor({ store }) {
    this.store = store;
    this.container = document.createElement('div');
    this.handleClick = this.handleClick.bind(this);
    this.editOption = debounce(this.editOption.bind(this), 100);
    this.editAnswer = this.editAnswer.bind(this);
    this.update = this.update.bind(this);
    this.init();
  }

  get elem() {
    return this.container;
  }

  init() {
    const {
      store,
      container,
      editOption,
      handleClick,
      editAnswer,
      update
    } = this;

    container.classList.add('options-container');
    container.onkeyup = editOption;
    container.onpaste = editOption;
    container.onclick = handleClick;
    container.onchange = editAnswer;

    store.subscribe(update);

    this.render();
  }

  update() {
    const { admin } = this.store.getState();
    const { quizForm } = admin;
    const { validating } = quizForm;
    if (validating) this.editOption.flush();
  }

  handleClick({ target }) {
    if (target.matches('.add-option-btn')) this.addOption();
    else if (target.matches('.rm-option-btn')) this.removeOption(target);
  }

  addOption() {
    const { admin } = this.store.getState();
    const { quizForm } = admin;
    const {
      id,
      options,
      hasMultipleAnswers
    } = quizForm.data;

    // 1. 선택지 5개 이하 유지
    const optionKeys = Object.keys(options).sort();
    if (optionKeys.length >= 5) return;

    // 2. 추가할 선택지의 key를 생성
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

    // 6. options에 새로운 선택지 추가
    this.store.dispatch(setQuizFormData({
      options: {
        ...options,
        [newKey]: ''
      }
    }));
  }

  removeOption(target) {
    const { admin } = this.store.getState();
    const { quizForm } = admin;
    const {
      id,
      options,
      answer,
      hasMultipleAnswers
    } = quizForm.data;

    // 1. 선택지 1개 이상 유지
    const optionKeys = Object.keys(options).sort();
    if (optionKeys.length <= 1) return;

    // 2. 삭제할 선택지의 options에서 제거
    const [, targetKey] = target.id.split('-');
    delete options[targetKey];

    // 2.1. 새로운 quizForm.data 생성
    let newData = { options };

    // 3. 삭제할 선택지 요소를 DOM에서 제거
    const targetNode = target.parentNode.parentNode;
    document.querySelector('.options').removeChild(targetNode);

    // 4. 선택지가 몇개인지 기록
    const keyCount = optionKeys.length - 1;

    // 5. 남은 선택지가 몇개인지 확인
    // 5.1. 남은 선택지가 1개일 때, 정답은 1개
    if (keyCount === 1) {
      // 5.1.1. multiple answers 체크 박스 사용 중지
      const ckMultipleAns = document.getElementById('ck-multipleAns');
      ckMultipleAns.checked = false;
      ckMultipleAns.disabled = true;

      // 5.1.2. 이전에 multiple answer이었다면 기본 선택지로 설정
      if (hasMultipleAnswers) {
        newData = {
          ...newData,
          answer: 'a',
          hasMultipleAnswers: false
        };

        // 5.1.3. 기본 선택지 요소 생성
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

        // 5.1.4. 기본 선택지로 교체
        document.querySelector('.options').innerHTML = defaultOption;
      }
    }

    // 5.2. 남은 선택지가 2개 이상일 때, 지워진 선택지가 정답이었는지 확인
    if (keyCount >= 2) {
      // 5.2.1. 지워진 선택지가 정답이었다면 default 답안지로 설정
      if (!hasMultipleAnswers && answer === targetKey) {
        newData = {
          ...newData,
          answer: 'a'
        };
        document.querySelector('input[value="a"]').checked = true;
      }
      // 5.2.1. 지워진 선택지가 정답이었다면 정답 목록에서 제거
      if (hasMultipleAnswers && answer.includes(targetKey)) {
        newData = {
          ...newData,
          answer: answer.filter(a => a !== targetKey)
        };
      }
    }

    this.store.dispatch(setQuizFormData(newData));
  }

  // 빠르게하면 수정이 안됨 (수정 필요)
  editOption({ target, clipboardData }) {
    if (!target.matches('.option-text')) return;

    const [, key] = target.id.split('-');
    const value = clipboardData
      ? clipboardData.getData('text')
      : target.value;

    const { admin } = this.store.getState();
    const { quizForm } = admin;
    const { options } = quizForm.data;
    options[key] = value;

    this.store.dispatch(setQuizFormData({ options }));
  }

  editAnswer({ target }) {
    const {
      type,
      value,
      checked
    } = target;
    const { store } = this;
    const { admin } = store.getState();
    const { quizForm } = admin;

    // check multiple answers
    if (target.id === 'ck-multipleAns') {
      const {
        id,
        options,
        answer: prevAnswer
      } = quizForm.data;

      const answer = checked
        ? [prevAnswer]
        : prevAnswer.length
          ? prevAnswer[0]
          : 'a';

      const hasMultipleAnswers = checked;

      const optionElems = Object.keys(options)
        .sort()
        .map((key, idx) => `<li class="option">
          <div class="option-wrapper">
            <input
              type="${checked ? 'checkbox' : 'radio'}"
              ${checked ? '' : `name="${id}-options"`} 
              value="${key}"
              ${checked ? answer.includes(key) ? 'checked' : '' : answer === key ? 'checked' : ''}
            />
            <input 
              id="option-${key}"
              class="option-text"
              type="text"
              value="${options[key]}"
            />
            ${idx >= 1 ? `<button id="rm-${key}" class="rm-option-btn">-</button>` : ''}
          </div>
        </li>`)
        .join('');

      document.querySelector('.options').innerHTML = optionElems;
      store.dispatch(setQuizFormData({ answer, hasMultipleAnswers }));
      return;
    }

    // single answer
    if (type === 'radio') {
      store.dispatch(setQuizFormData({ answer: value }));
      return;
    }

    if (type === 'checkbox') { // multiple answer
      const { answer } = quizForm.data;
      store.dispatch(setQuizFormData({
        answer: checked
          ? [...answer, value].sort()
          : answer.filter(a => a !== value)
      }));
    }
  }

  render() {
    const { container, store } = this;
    const { admin } = store.getState();
    const { quizForm } = admin;
    const {
      id,
      options,
      answer,
      hasMultipleAnswers
    } = quizForm.data;

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
