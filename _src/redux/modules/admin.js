/*
 * action types
 */
export const FETCH_QUIZZES = 'FETCH_QUIZZES';
export const ADD_QUIZ = 'ADD_QUIZ';
export const EDIT_QUIZ = 'EDIT_QUIZ';
export const REMOVE_QUIZ = 'REMOVE_QUIZ';
export const REMOVE_SELECTED_QUIZZES = 'REMOVE_SELECTED_QUIZZES';
export const SELECT_QUIZ = 'SELECT_QUIZ';
export const SET_QUIZ_FORM = 'SET_QUIZ_FORM';
export const SET_QUIZ_FORM_DATA = 'SET_QUIZ_FORM_DATA';
export const TOGGLE_NAV = 'TOGGLE_NAV';
export const SET_ADMIN_ERROR = 'SET_ADMIN_ERROR';
export const SET_ADMIN_LOADING = 'SET_ADMIN_LOADING';

/*
 * action creators
 */
export const fetchQuizzes = quizzes => ({
  type: FETCH_QUIZZES,
  quizzes
});

export const addQuiz = quiz => ({
  type: ADD_QUIZ,
  quiz
});

export const editQuiz = quiz => ({
  type: EDIT_QUIZ,
  quiz
});

export const removeQuiz = id => ({
  type: REMOVE_QUIZ,
  id
});

export const removeSelectedQuizzes = quizzes => ({
  type: REMOVE_SELECTED_QUIZZES,
  quizzes
});

export const selectQuiz = quiz => ({
  type: SELECT_QUIZ,
  quiz
});

export const setQuizForm = quizForm => ({
  type: SET_QUIZ_FORM,
  quizForm
});

export const setQuizFormData = data => ({
  type: SET_QUIZ_FORM_DATA,
  data
});

export const toggleNav = category => ({
  type: TOGGLE_NAV,
  category
});

export const setAdminError = error => ({
  type: SET_ADMIN_ERROR,
  error
});

export const setAdminLoading = loading => ({
  type: SET_ADMIN_LOADING,
  loading
});

/*
* reducer
*/
const initialState = {
  quizzes: [],
  quizForm: {
    on: false,
    type: '',
    validating: false,
    data: null
  },
  category: 'all',
  loading: false,
  error: null
};

export default function admin(state = initialState, action) {
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

    case SET_ADMIN_LOADING:
      return {
        ...state,
        loading: action.loading
      };

    case SET_ADMIN_ERROR:
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
