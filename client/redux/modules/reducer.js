import { combineReducers } from 'redux';
import admin from './admin';
import home from './home';

const reducer = combineReducers({
  admin,
  home
});

export default reducer;
