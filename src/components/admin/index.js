import Header from './Header';
import Main from './Main';
import QuestionService from '../../services/QuestionService';

export default class Admin {
  constructor() {
    this.$body = document.querySelector('body');
    this.init();
  }

  async init() {
    this.$header = new Header({ title: '문제 등록 페이지' });
    try {
      this.$main = new Main({ title: '문제 등록 페이지' });
    } catch (err) {
      console.error(err);
    }

    // try {
    //   const res = await QuestionService.fetchQuestions();
    //   const questions = await res.json();

    //   this.setState({ questions });
    //   this.$main = new Main({ title: '메인 영역' });
    // } catch (err) {
    //   console.error(err);
    // }

    // this.render();
    // this.$body.appendChild(this.$header.$container);
    // this.$body.appendChild(this.$main.$container);
  }

  toggleNav({ target }) {
    if (!target.matches('.menu-item a')) return;
    const { id: tab } = target.parentNode;
    this.setState({ tab });

    if (tab === 'add') {
      // 등록하거나
      // 취소하는 경우
      console.log('add');
    } else {
      [...this.$header.$nav.$menu.$container.children].forEach($li => {
        $li.classList.toggle('active', $li === target.parentNode);
      });
      this.render();
    }
  }

  render() {
    const questions = this.state.questions
      .filter(({ category }) => category === this.state.tab)
      .map(({ id, title, body, hasCode, choices }) => {
        const { a, b, c, d } = choices;
        return `<li class="question">
          <article id="${id}">
            <h3 class="quiestion-title">${title}</h3>
            ${hasCode ? `<pre class="question-body"><code>${body}</code></pre>` : `<p class="question-body">${body}</p>`}
            <div class="radiogroup">
              <label><input data-ans="a" type="radio" name="${id}-choices" value="${a}"/>${a}</label>
              <label><input data-ans="b" type="radio" name="${id}-choices" value="${b}"/>${b}</label>
              <label><input data-ans="c" type="radio" name="${id}-choices" value="${c}"/>${c}</label>
              <label><input data-ans="d" type="radio" name="${id}-choices" value="${d}"/>${d}</label>
            </div>
          </article>
        </li>`;
      });

    this.$main.$questions.$container.innerHTML = questions.join('');
  }
}
