import './style.scss';

export default class Container {
  constructor(props) {
    this.props = props;
    this.container = document.createElement('div');
    this.init();
  }

  init() {
    const { type } = this.props;
    this.container.classList.add(type);
  }

  render() {
    const { children } = this.props;
    children.forEach(child => this.container.appendChild(child.render()))

    return this.container;
  }
}
