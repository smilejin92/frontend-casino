import { combineReducers } from 'redux';
import admin from './admin';
import home from './home';
import router from './router';

const reducer = combineReducers({
  admin,
  home,
  router,
});

export default reducer;
