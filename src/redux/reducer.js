import {
  ADD_QUIZ,
  TOGGLE_NAV,
  FETCH_QUIZZES,
  SET_ERROR,
  SET_MODAL,
  EDIT_QUIZ,
  REMOVE_QUIZ,
  SELECT_QUIZ,
  REMOVE_SELECTED_QUIZZES
} from './actions';

const initialState = {
  quizzes: [],
  modal: {
    on: false,
    type: '',
    id: null
  },
  points: [1000, 2500, 5000, 10000],
  seconds: [30, 45, 60, 90],
  categories: ['html', 'css', 'javascript'],
  tabs: ['all', 'html', 'css', 'javascript'],
  tab: 'all',
  error: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_MODAL:
      return {
        ...state,
        modal: action.modal,
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
        tab: action.quiz.category,
        quizzes: [action.quiz, ...state.quizzes]
      };

    case EDIT_QUIZ:
      return {
        ...state,
        tab: action.quiz.category,
        quizzes: state.quizzes.map(q => (q.id === action.quiz.id ? action.quiz : q))
      };

    case REMOVE_QUIZ:
      return {
        ...state,
        quizzes: state.quizzes.filter(q => q.id !== action.id)
      };

    case SELECT_QUIZ:
      return {
        ...state,
        quizzes: state.quizzes.map(q => (q.id === action.quiz.id ? action.quiz : q))
      };

    case REMOVE_SELECTED_QUIZZES:
      return {
        ...state,
        quizzes: action.quizzes.sort((q1, q2) => q2.id - q1.id)
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
