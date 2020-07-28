export const SET_PAGE = 'SET_PAGE';

export const setPage = page => ({
  type: SET_PAGE,
  page
});

const initialState = {
  page: ''
};

export default function router(state = initialState, action) {
  switch (action.type) {
    case SET_PAGE:
      return {
        ...state,
        page: action.page
      };

    default:
      return state;
  }
}
