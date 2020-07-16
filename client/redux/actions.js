/*
 * action types
 */

export const FETCH_QUIZZES = 'FETCH_QUIZZES';
export const ADD_QUIZ = 'ADD_QUIZ';
export const EDIT_QUIZ = 'EDIT_QUIZ';
export const REMOVE_QUIZ = 'REMOVE_QUIZ';
export const REMOVE_SELECTED_QUIZZES = 'REMOVE_SELECTED_QUIZZES';
export const SELECT_QUIZ = 'SELECT_QUIZ';
export const SET_ERROR = 'SET_ERROR';
export const TOGGLE_NAV = 'TOGGLE_NAV';
export const SET_QUIZ_FORM = 'SET_QUIZ_FORM';
export const SET_QUIZ_FORM_DATA = 'SET_QUIZ_FORM_DATA';

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

export const setError = error => ({
  type: SET_ERROR,
  error
});

export const toggleNav = category => ({
  type: TOGGLE_NAV,
  category
});

export const setQuizForm = quizForm => ({
  type: SET_QUIZ_FORM,
  quizForm
});

export const setQuizFormData = data => ({
  type: SET_QUIZ_FORM_DATA,
  data
});
