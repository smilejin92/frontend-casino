import './style.scss';

// props.children의 요소(자식 노드)를 append한다.
export default class Header {
  constructor(props) {
    this.props = props;
    this.header = document.createElement('header');
    this.init();
  }

  get elem() {
    return this.header;
  }

  init() {
    this.header.classList.add('header');
    this.render();
  }

  render() {
    const { props, header } = this;
    props.children.forEach(child => header.appendChild(child.elem));
  }
}
