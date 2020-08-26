import { createAction, handleAction } from 'redux-actions';

// ACTION
const SET_PAGE = 'front-end-casino/router/SET_PAGE';

// ACTION CREATOR
export const setPage = createAction(SET_PAGE, location => location);

// INITIAL STATE
const initialState = {
  page: null,
  pathname: null,
};

// REDUCER
const router = handleAction(
  SET_PAGE,
  (_, { payload }) => ({
    ...payload,
  }),
  initialState
);

export default router;
