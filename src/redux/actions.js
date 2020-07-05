/*
 * action types
 */

export const FETCH_QUIZZES = 'FETCH_QUIZZES';
export const SET_ERROR = 'SET_ERROR';
export const ADD_QUIZ = 'ADD_QUIZ';
export const EDIT_QUIZ = 'EDIT_QUIZ';
export const REMOVE_QUIZ = 'REMOVE_QUIZ';
export const REMOVE_SELECTED_QUIZZES = 'REMOVE_SELECTED_QUIZZES';
export const SELECT_QUIZ = 'SELECT_QUIZ';
export const TOGGLE_NAV = 'TOGGLE_NAV';
export const SET_MODAL = 'SET_MODAL';

/*
 * action creators
 */

export const removeSelectedQuizzes = quizzes => ({
  type: REMOVE_SELECTED_QUIZZES,
  quizzes
});

export const selectQuiz = quiz => ({
  type: SELECT_QUIZ,
  quiz
});

export const removeQuiz = id => ({
  type: REMOVE_QUIZ,
  id
});

export const editQuiz = quiz => ({
  type: EDIT_QUIZ,
  quiz
});

export const setModal = modal => ({
  type: SET_MODAL,
  modal
});

export const setError = error => ({
  type: SET_ERROR,
  error
});

export const fetchQuizzes = quizzes => ({
  type: FETCH_QUIZZES,
  quizzes
});

export const addQuiz = quiz => ({
  type: ADD_QUIZ,
  quiz
});

export const toggleNav = tab => ({
  type: TOGGLE_NAV,
  tab
});
