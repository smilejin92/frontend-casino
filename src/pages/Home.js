export default class Home {
  constructor({ store }) {
    this.store = store;
  }

  render() {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(document.createElement('p'));

    return fragment;
  }
}
