// actions
export const FETCH_USERS = 'FETCH_USERS';
export const SET_HOME_LOADING = 'SET_HOME_LOADING';
export const SET_HOME_ERROR = 'SET_HOME_ERROR';

// action creators
export const fetchUsers = users => ({
  type: FETCH_USERS,
  users,
});

export const setHomeLoading = loading => ({
  type: SET_HOME_LOADING,
  loading
});

export const setHomeError = error => ({
  type: SET_HOME_ERROR,
  error
});

// set initial state
const initialState = {
  users: [],
  loading: false,
  error: null
};

export default function home(state = initialState, action) {
  switch (action.type) {
    case FETCH_USERS:
      return {
        ...state,
        users: action.users,
      };

    case SET_HOME_LOADING:
      return {
        ...state,
        loading: action.loading
      };

    case SET_HOME_ERROR:
      return {
        ...state,
        error: action.error
      };

    default:
      return state;
  }
}
