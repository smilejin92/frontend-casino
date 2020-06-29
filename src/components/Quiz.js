import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/monokai-sublime.css';
import javascript from 'highlight.js/lib/languages/javascript';
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('css', css);
hljs.registerLanguage('html', html);

export default function Quiz(q) {
  return `<li class="question">
    <article id="${q.id}">
      <h3 class="question-title">Q${q.id}) ${q.title} (${q.point}P)</h3>
      <dl class="question-info clearfix">
        <div class="info-group">
          <dt>category</dt>
          <dd>${q.category.toUpperCase()}</dd>
        </div>
        <div class="info-group">
          <dt>point</dt>
          <dd>${q.point}</dd>
        </div>
        <div class="info-group">
          <dt>time (sec)</dt>
          <dd>${q.time}</dd>
        </div>
      </dl>
      ${q.hasCode ? `<pre class="question-body"><code>${hljs.highlight(q.category, q.body).value}</code></pre>` : `<p class="question-body">${q.body}</p>`}
      <div class="radiogroup">
        ${Object.keys(q.choices).map(k => `<label>
            <input 
              type="radio" 
              name="${q.id}-choices" 
              ${q.answer === k ? 'checked' : ''} 
              value="${q.choices[k]}"
              disabled
            />
            ${q.choices[k]}
          </label>`).join('')}
      </div>
      <input type="checkbox" ${q.selected ? 'checked' : ''} />
    </article>
  </li>`;
}
