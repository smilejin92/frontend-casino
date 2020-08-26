import { all } from 'redux-saga/effects';
import { adminSaga } from '../modules/admin';

export default function* rootSaga() {
  yield all([adminSaga()]);
}
