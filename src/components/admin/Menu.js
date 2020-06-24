export default class Menu {
  constructor({ toggleNav }) {
    this.$container = document.createElement('ul');
    this.$container.onclick = toggleNav;
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
}
