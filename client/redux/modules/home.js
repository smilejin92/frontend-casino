/*
 * action types
 */
export const FETCH_USERS = 'FETCH_USERS';

/*
 * action creators
 */
export const fetchUsers = users => ({
  type: FETCH_USERS,
  users
});

/*
* reducer
*/
const initialState = {
  users: []
};

export default function home(state = initialState, action) {
  switch (action.type) {
    case FETCH_USERS:
      return {
        ...state,
        users: action.users
      };

    default:
      return state;
  }
}
