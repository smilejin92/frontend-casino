import { createStore } from 'redux';
import reducer from './modules/reducer';

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export const getStore = () => store;

export default store;
