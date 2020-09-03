import { combineReducers } from 'redux';
import router from './router';
import admin from './admin';
import home from './home';

const reducer = combineReducers({
  router,
  admin,
  home,
});

export default reducer;
