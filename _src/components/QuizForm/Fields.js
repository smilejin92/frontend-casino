export default class Fields {
  constructor({ children }) {
    this.children = children;
    this.fields = document.createElement('div');
    this.init();
  }

  init() {
    this.fields.setAttribute('role', 'group');
    this.fields.classList.add('fields');
    this.render();
  }

  render() {
    const { fields, children } = this;
    children.forEach(child => fields.appendChild(child.render()));

    return fields;
  }
}
