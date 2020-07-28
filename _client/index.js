import '@babel/polyfill';
import './assets/favicon.ico';
import App from './App';

const root = document.getElementById('root');

root.appendChild(new App().render());
