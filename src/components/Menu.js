export default class Menu {
  constructor() {
    this.state = { tab: 'html' };
    this.observers = [];
    this.$container = document.createElement('ul');
    this.$container.onclick = this.toggleNav.bind(this);
    this.init();
  }

  init() {
    this.$container.classList.add('menu');
    this.$container.innerHTML = `
      <li id="html" class="menu-item active"><a href="#">HTML</a></li>
      <li id="css" class="menu-item"><a href="#">CSS</a></li>
      <li id="js" class="menu-item"><a href="#">JavaScript</a></li>
      <li id="add" class="menu-item"><a href="#" role="button">문제 등록</a></li>
    `;
  }

  setState(cur, next) {
    if (cur.tab === next.tab) return;
    this.state = { ...next };
    this.notify();
  }

  notify() {
    this.observers.forEach(o => {
      o.update();
    });
  }

  toggleNav({ target }) {
    if (!target.matches('.menu-item a')) return;

    [...this.$container.children].forEach($li => {
      $li.classList.toggle('active', $li === target.parentNode);
    });

    this.setState(this.state, { tab: target.parentNode.id });
  }
}
