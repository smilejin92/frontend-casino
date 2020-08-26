import './style.scss';

export default class ErrorList {
  constructor({ store }) {
    this.store = store;
    this.errorList = document.createElement('ul');
    this.state = { error: null };
    this.update = this.update.bind(this);
    this.unsubscribe = null;
    this.init();
  }

  init() {
    this.errorList.classList.add('errors');
    const { admin } = this.store.getState();
    const { error } = admin;
    this.setState({ error });

    const { update } = this;
    this.unsubscribe = this.store.subscribe(update);
    console.log('ErrorList subscribed');
  }

  setState(newState) {
    this.state = newState;
  }

  update() {
    const { admin } = this.store.getState();
    const { error, quizForm } = admin;
    if (!quizForm.on) {
      console.log('ErrorList unsubscribed');
      this.unsubscribe();
    }

    if (error === this.state.error) return;

    this.setState({ error });
    this.render();
  }

  render() {
    const { error } = this.state;
    this.errorList.classList.toggle('active', error !== null);
    this.errorList.innerHTML = error
      ? `${error.data.map(err => `<li class="error">${err.message}</li>`).join('')}`
      : '';

    return this.errorList;
  }
}
