import { all } from 'redux-saga/effects';
import { adminSaga } from '../modules/admin';
import { homeSaga } from '../modules/home';

export default function* rootSaga() {
  yield all([adminSaga(), homeSaga()]);
}
