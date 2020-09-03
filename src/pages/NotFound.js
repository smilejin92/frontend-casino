export default class NotFound {
  constructor({ store }) {
    this.store = store;
  }

  render() {
    const fragment = document.createDocumentFragment();
    fragment.appendChild('페이지를 찾을 수 없음');

    return fragment;
  }
}
