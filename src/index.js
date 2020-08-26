import '@babel/polyfill';
import create from './redux/create';
import App from './App';

const root = document.getElementById('root');
const store = create();

new App({ root, store }).render();
