// actions
export const SET_PAGE = 'SET_PAGES';

// action creators
export const setPage = page => ({
  type: SET_PAGE,
  page,
});

// set initial state
const { history, location } = window;
const { pathname } = location;

const page = pathname === '/' ? 'home' : pathname === '/admin' ? 'admin' : 'error';

if (!history.state) {
  history.replaceState({ page }, 'Frontend Casino', pathname);
}

const initialState = {
  page,
};

// module
export default function router(state = initialState, action) {
  switch (action.type) {
    case SET_PAGE:
      return {
        ...state,
        page: action.page,
      };

    default:
      return state;
  }
}
