import './style.scss';
import { toggleHelp } from '../../redux/modules/home';

export default class HelpButton {
  constructor({ store }) {
    this.helpButton = document.createElement('button');
    this.store = store;
    this.displayHelp = this.displayHelp.bind(this);
    this.init();
  }

  init() {
    this.helpButton.classList.add('help-button', 'icon-help-circled');
    this.helpButton.setAttribute('aria-label', 'help-button');
    this.helpButton.onclick = this.displayHelp;
  }

  displayHelp() {
    this.store.dispatch(toggleHelp());
  }

  render() {
    return this.helpButton;
  }
}
