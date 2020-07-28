export default class NotFound {
  render() {
    const container = document.createElement('div');
    container.innerHTML = '페이지를 찾을 수 없음';
    return container;
  }
}
