import { handleActions, createAction, createActions } from 'redux-actions';
import { takeEvery, put, call } from 'redux-saga/effects';
import UserService from '../../services/UserService';

// ACTION CREATORS
const prefix = 'front-end-casino/home';

// fetch users
// front-end-casino/home/FETCH_USERS_XXX
const {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure
} = createActions(
  {
    FETCH_USERS_SUCCESS: users => users,
    FETCH_USERS_FAILURE: error => error,
  },
  'FETCH_USERS_REQUEST',
  {
    prefix
  }
);

// INITIAL STATE
const initialState = {
  users: [],
  loading: false,
  error: null
};

// REDUCER
const reducer = handleActions(
  {
    FETCH_USERS_REQUEST: state => ({
      ...state,
      loading: true,
    }),
    FETCH_USERS_SUCCESS: (state, { payload }) => ({
      ...state,
      users: payload,
      loading: false
    }),
    FETCH_USERS_FAILURE: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload
    })
  },
  initialState,
  {
    prefix
  }
);

// SAGA ACTION
const FETCH_USERS = `${prefix}/FETCH_USERS`;

export const fetchUsers = createAction(FETCH_USERS);

// SAGA FUNCTION
function* requestFetchUsers() {
  try {
    yield put(fetchUsersRequest());
    const res = yield call(UserService.fetchUsers);
    const users = yield res.json();

    yield put(fetchUsersSuccess(users.sort((u1, u2) => u2.point - u1.point)));
  } catch (err) {
    yield put(fetchUsersFailure(err));
    console.error(err);
  }
}

// SAGA
export function* homeSaga() {
  yield takeEvery(FETCH_USERS, requestFetchUsers);
}

export default reducer;
