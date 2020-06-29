import {
  ADD_QUIZ,
  TOGGLE_NAV,
  FETCH_QUIZZES,
  SET_ERROR,
  SET_MODAL
} from './actions';

const initialState = {
  quizzes: [],
  modal: {
    on: false,
    type: ''
  },
  menu: ['all', 'html', 'css', 'javascript'],
  categories: ['html', 'css', 'javascript'],
  points: [1000, 2500, 5000, 10000],
  seconds: [30, 45, 60, 90],
  tab: 'all',
  error: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_MODAL:
      return {
        ...state,
        modal: action.modal
      };

    case SET_ERROR:
      return {
        ...state,
        error: action.error
      };

    case FETCH_QUIZZES:
      return {
        ...state,
        quizzes: action.quizzes
      };

    case ADD_QUIZ:
      return {
        ...state,
        quizzes: [action.quiz, ...state.quizzes]
      };

    case TOGGLE_NAV:
      return {
        ...state,
        tab: action.tab
      };

    default:
      return state;
  }
}
