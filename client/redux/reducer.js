import {
  FETCH_QUIZZES,
  ADD_QUIZ,
  EDIT_QUIZ,
  REMOVE_QUIZ,
  REMOVE_SELECTED_QUIZZES,
  SELECT_QUIZ,
  SET_ERROR,
  TOGGLE_NAV,
  SET_QUIZ_FORM,
  SET_QUIZ_FORM_DATA
} from './actions';

const initialState = {
  quizzes: [],
  quizForm: {
    on: false,
    type: '',
    validating: false,
    data: null
  },
  category: 'all',
  error: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_QUIZZES:
      return {
        ...state,
        quizzes: action.quizzes
      };

    case ADD_QUIZ:
      return {
        ...state,
        category: action.quiz.category,
        quizzes: [action.quiz, ...state.quizzes]
      };

    case EDIT_QUIZ:
      return {
        ...state,
        category: action.quiz.category,
        quizzes: state.quizzes.map(q => (q.id === action.quiz.id ? action.quiz : q))
      };

    case REMOVE_QUIZ:
      return {
        ...state,
        quizzes: state.quizzes.filter(q => q.id !== action.id)
      };

    case REMOVE_SELECTED_QUIZZES:
      return {
        ...state,
        quizzes: action.quizzes.sort((q1, q2) => q2.id - q1.id)
      };

    case SELECT_QUIZ:
      return {
        ...state,
        quizzes: state.quizzes.map(q => (q.id === action.quiz.id ? action.quiz : q))
      };

    case SET_ERROR:
      return {
        ...state,
        error: action.error
      };

    case TOGGLE_NAV:
      return {
        ...state,
        category: action.category
      };

    case SET_QUIZ_FORM:
      return {
        ...state,
        quizForm: {
          ...state.quizForm,
          ...action.quizForm
        }
      };

    case SET_QUIZ_FORM_DATA:
      return {
        ...state,
        quizForm: {
          ...state.quizForm,
          data: {
            ...state.quizForm.data,
            ...action.data
          }
        }
      };

    default:
      return state;
  }
}
