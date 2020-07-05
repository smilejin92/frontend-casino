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
      <h3 class="question">Q${q.id}) ${q.question} (${q.point}P)</h3>
      <dl class="quiz-info clearfix">
        <div class="info">
          <dt>category</dt>
          <dd>${q.category.toUpperCase()}</dd>
        </div>
        <div class="info">
          <dt>point</dt>
          <dd>${q.point}</dd>
        </div>
        <div class="info">
          <dt>time (sec)</dt>
          <dd>${q.second}</dd>
        </div>
      </dl>
      ${q.hasCode ? `<pre class="content"><code>${hljs.highlight(q.category, q.content).value}</code></pre>` : `<p class="content">${q.content}</p>`}
      <ul class="options">
        ${Object.keys(q.options).map(k => `<li class="option">
          <label>
              <input 
                type="radio" 
                name="${q.id}-options" 
                ${q.answer === k ? 'checked' : ''} 
                value="${q.options[k]}"
                disabled
              />
              ${q.options[k]}
          </label>
        </li>`).join('')}
      </ul>
      <input type="checkbox" ${q.selected ? 'checked' : ''} />
      <button class="edit-quiz">Edit</button>
      <button class="rm-quiz">Remove</button>
    </article>
  </li>`;
}
