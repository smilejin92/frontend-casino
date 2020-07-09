import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/monokai-sublime.css';
import javascript from 'highlight.js/lib/languages/javascript';
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('css', css);
hljs.registerLanguage('html', html);

export default function Quiz(q) {
  return `<li class="quiz">
    <article id="${q.id}">
      <h3 class="question">Q${q.id}) ${q.question}</h3>
      <dl class="quiz-info clearfix">
        <div class="info category">
          <dt class="a11y-hidden">category</dt>
          <dd>${q.category.toUpperCase()}</dd>
        </div>
        <div class="info point">
          <dt class="a11y-hidden">point</dt>
          <dd>${q.point}</dd>
        </div>
        <div class="info time">
          <dt class="a11y-hidden">time (sec)</dt>
          <dd>${q.second}</dd>
        </div>
      </dl>
      ${q.content
          ? `<pre class="content">${q.hasCode ? `<code>${hljs.highlight(q.category, q.content).value}</code>` : q.content}</pre>`
          : ''}
      <ul class="options">
        ${Object.keys(q.options).map(k => `<li class="option">
          <label>
              <input 
                type="${q.hasMultipleAnswers ? 'checkbox' : 'radio'}" 
                ${q.hasMultipleAnswers ? '' : `name="${q.id}-options"`} 
                ${q.hasMultipleAnswers
                  ? q.answer.includes(k)
                    ? 'checked'
                    : ''
                  : q.answer === k
                    ? 'checked'
                    : ''}
                value="${q.options[k]}"
                disabled
              />
              ${q.options[k]}
          </label>
        </li>`).join('')}
      </ul>
      <div class="actions">
        <button class="edit-quiz">Edit</button>
        <button class="rm-quiz">Remove</button>
        <input class="select-quiz" type="checkbox" ${q.selected ? 'checked' : ''} />
      </div>
    </article>
  </li>`;
}
