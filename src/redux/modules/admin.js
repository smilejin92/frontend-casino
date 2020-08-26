import { createActions, handleActions, createAction } from 'redux-actions';
import { takeEvery, put, call } from 'redux-saga/effects';
import QuizService from '../../services/QuizService';

// ACTION CREATORS
const prefix = 'front-end-casino/admin';

// fetch quizzes
// front-end-casino/admin/FETCH_QUIZZES_XXX
const {
  fetchQuizzesRequest,
  fetchQuizzesSuccess,
  fetchQuizzesFailure,
} = createActions(
  {
    FETCH_QUIZZES_SUCCESS: quizzes => quizzes,
    FETCH_QUIZZES_FAILURE: error => error,
  },
  'FETCH_QUIZZES_REQUEST',
  {
    prefix,
  }
);

// post quiz
// front-end-casino/admin/POST_QUIZ_XXX
const { postQuizRequest, postQuizSuccess, postQuizFailure } = createActions(
  {
    POST_QUIZ_SUCCESS: quiz => quiz,
    POST_QUIZ_FAILURE: error => error,
  },
  'POST_QUIZ_REQUEST',
  {
    prefix,
  }
);

// edit(put) quiz
// front-end-casino/admin/EDIT_QUIZ_XXX
const { editQuizRequest, editQuizSuccess, editQuizFailure } = createActions(
  {
    EDIT_QUIZ_SUCCESS: quiz => quiz,
    EDIT_QUIZ_FAILURE: error => error,
  },
  'EDIT_QUIZ_REQUEST',
  {
    prefix,
  }
);

// select(patch) quiz
// front-end-casino/admin/SELECT_QUIZ_XXX
const {
  selectQuizRequest,
  selectQuizSuccess,
  selectQuizFailure,
} = createActions(
  {
    SELECT_QUIZ_SUCCESS: quiz => quiz,
    SELECT_QUIZ_FAILURE: error => error,
  },
  'SELECT_QUIZ_REQUEST',
  {
    prefix,
  }
);

// delete quiz
// front-end-casino/admin/DELETE_QUIZ_XXX
const {
  deleteQuizRequest,
  deleteQuizSuccess,
  deleteQuizFailure,
} = createActions(
  {
    DELETE_QUIZ_SUCCESS: quizId => quizId,
    DELETE_QUIZ_FAILURE: error => error,
  },
  'DELETE_QUIZ_REQUEST',
  {
    prefix,
  }
);

const {
  deleteSelectedQuizzesRequest,
  deleteSelectedQuizzesSuccess,
  deleteSelectedQuizzesFailure,
} = createActions(
  {
    DELETE_SELECTED_QUIZZES_SUCCESS: quizzes => quizzes,
    DELETE_SELECTED_QUIZZES_FAILURE: error => error,
  },
  'DELETE_SELECTED_QUIZZES_REQUEST',
  {
    prefix
  }
);

// front-end-casino/admin/SET_QUIZ_FORM_XXX
// front-end-casino/admin/TOGGLE_NAV
export const { setQuizForm, setQuizFormData, toggleNav } = createActions(
  {
    SET_QUIZ_FORM: quizForm => quizForm,
    SET_QUIZ_FORM_DATA: data => data,
  },
  'TOGGLE_NAV',
  {
    prefix,
  }
);

// INITIAL STATE
const initialState = {
  quizzes: [],
  quizForm: {
    on: false,
    type: '',
    validating: false,
    data: null,
  },
  category: 'all',
  loading: false,
  error: null,
};

// REDUCER
const reducer = handleActions(
  {
    FETCH_QUIZZES_REQUEST: state => ({
      ...state,
      loading: true,
    }),
    FETCH_QUIZZES_SUCCESS: (state, { payload }) => ({
      ...state,
      quizzes: payload,
      loading: false,
    }),
    FETCH_QUIZZES_FAILURE: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
    }),
    POST_QUIZ_REQUEST: state => ({
      ...state,
      loading: true,
      quizForm: {
        ...state.quizForm,
        validating: false
      }
    }),
    POST_QUIZ_SUCCESS: (state, { payload }) => ({
      ...state,
      category: payload.category,
      quizzes: [payload, ...state.quizzes],
      loading: false,
      error: null
    }),
    POST_QUIZ_FAILURE: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
      quizForm: {
        ...state.quizForm,
        validating: false
      }
    }),
    EDIT_QUIZ_REQUEST: state => ({
      ...state,
      loading: true,
      quizForm: {
        ...state.quizForm,
        validating: false
      }
    }),
    EDIT_QUIZ_SUCCESS: (state, { payload }) => ({
      ...state,
      category: payload.category,
      quizzes: state.quizzes.map(q => (q.id === payload.id ? payload : q)),
      loading: false,
      error: null
    }),
    EDIT_QUIZ_FAILURE: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
      quizForm: {
        ...state.quizForm,
        validating: false
      }
    }),
    SELECT_QUIZ_REQUEST: state => ({
      ...state,
      loading: true,
    }),
    SELECT_QUIZ_SUCCESS: (state, { payload }) => ({
      ...state,
      quizzes: state.quizzes.map(q => (q.id === payload.id ? payload : q)),
      loading: false,
    }),
    SELECT_QUIZ_FAILURE: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload
    }),
    DELETE_QUIZ_REQUEST: state => ({
      ...state,
      loading: true
    }),
    DELETE_QUIZ_SUCCESS: (state, { payload }) => ({
      ...state,
      quizzes: state.quizzes.filter(q => q.id !== payload),
      loading: false
    }),
    DELETE_QUIZ_FAILURE: (state, { payload }) => ({
      ...state,
      error: payload,
      loading: false
    }),
    DELETE_SELECTED_QUIZZES_REQUEST: state => ({
      ...state,
      loading: true
    }),
    DELETE_SELECTED_QUIZZES_SUCCESS: (state, { payload }) => ({
      ...state,
      quizzes: payload.sort((q1, q2) => q2.id - q1.id),
      loading: false
    }),
    DELETE_SELECTED_QUIZZES_FAILURE: (state, { payload }) => ({
      ...state,
      error: payload,
      loading: false
    }),
    SET_QUIZ_FORM: (state, { payload }) => ({
      ...state,
      quizForm: {
        ...state.quizForm,
        ...payload,
      },
      error: payload.on ? state.error : null
    }),
    SET_QUIZ_FORM_DATA: (state, { payload }) => {
      const data = {
        ...state.quizForm.data,
        ...payload,
      };

      // if error is null, return new state.
      if (state.error === null) {
        return {
          ...state,
          quizForm: {
            ...state.quizForm,
            data
          },
        };
      }

      // if error is an object
      const error = { data: [...state.error.data] };

      if (state.error) {
        // error contains "title" type & data.question.length
        const titleErr = error.data.find(({ type }) => type === 'title');
        if (titleErr && data.question.length) {
          error.data = error.data.filter(err => err.type !== 'title');
        }

        // error contains "options" type & data.options[key].length
        const optionsErr = error.data.find(({ type }) => type === 'options');
        const optionHasValue = Object
          .keys(data.options)
          .every(k => data.options[k].trim());

        if (optionsErr && optionHasValue) {
          error.data = error.data.filter(err => err.type !== 'options');
        }

        // error contains "answer" type & data.answer.length
        const answerErr = error.data.find(({ type }) => type === 'answer');
        if (answerErr && data.hasMultipleAnswers && data.answer.length) {
          error.data = error.data.filter(err => err.type !== 'answer');
        }
      }

      return {
        ...state,
        quizForm: {
          ...state.quizForm,
          data
        },
        error: error.data.length ? error : null
      };
    },
    TOGGLE_NAV: (state, { payload }) => ({
      ...state,
      category: payload
    }),
  },
  initialState,
  {
    prefix,
  }
);

// SAGA ACTION
const FETCH_QUIZZES = `${prefix}/FETCH_QUIZZES`;
const POST_QUIZ = `${prefix}/POST_QUIZ`;
const EDIT_QUIZ = `${prefix}/EDIT_QUIZ`;
const SELECT_QUIZ = `${prefix}/SELECT_QUIZ`;
const DELETE_QUIZ = `${prefix}/DELETE_QUIZ`;
const DELETE_SELECTED_QUIZZES = `${prefix}/DELETE_SELECTED_QUIZZES`;

export const fetchQuizzes = createAction(FETCH_QUIZZES);
export const postQuiz = createAction(POST_QUIZ);
export const editQuiz = createAction(EDIT_QUIZ);
export const selectQuiz = createAction(SELECT_QUIZ);
export const deleteQuiz = createAction(DELETE_QUIZ);
export const deleteSelectedQuizzes = createAction(DELETE_SELECTED_QUIZZES);

// SAGA FUNCTION
// get quizzes
function* requestFetchQuizzes() {
  try {
    yield put(fetchQuizzesRequest());
    const res = yield call(QuizService.fetchQuizzes);
    const quizzes = yield res.json(); // what is the difference?

    yield put(fetchQuizzesSuccess(quizzes.sort((q1, q2) => q2.id - q1.id)));
  } catch (err) {
    yield put(fetchQuizzesFailure(err));
    console.error(err);
  }
}

// add quiz
function* requestPostQuiz({ payload }) {
  try {
    yield put(setQuizForm({ validating: true }));
    yield call(QuizService.validateInput, payload);
    const data = yield call(QuizService.escapeHtml, payload);

    yield put(postQuizRequest());

    const res = yield call(QuizService.addQuiz, data);
    const addedQuiz = yield res.json();

    yield put(postQuizSuccess(addedQuiz));

    yield put(setQuizForm({
      type: '',
      on: false,
      data: null,
    }));

    const position = document.getElementById(addedQuiz.id); // should I use call instead?
    position.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch (err) {
    yield put(postQuizFailure(err));
    console.error(err);
  }
}

// edit quiz
function* requestEditQuiz({ payload }) {
  try {
    yield put(setQuizForm({ validating: true }));
    yield call(QuizService.validateInput, payload);
    const data = yield call(QuizService.escapeHtml, payload);

    yield put(editQuizRequest());

    const res = yield call(QuizService.editQuiz, data);
    const editedQuiz = yield res.json();

    yield put(editQuizSuccess(editedQuiz));

    yield put(setQuizForm({
      type: '',
      on: false,
      data: null,
    }));

    const position = document.getElementById(editedQuiz.id);
    position.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch (err) {
    yield put(editQuizFailure(err));
    console.error(err);
  }
}

// select quiz
function* requestSelectQuiz({ payload }) {
  try {
    yield put(selectQuizRequest());
    const { id, selected } = payload;
    const res = yield call(QuizService.selectQuiz, id, { selected });
    const quiz = yield res.json();
    yield put(selectQuizSuccess(quiz));
  } catch (err) {
    yield put(selectQuizFailure(err));
    console.error(err);
  }
}

// delete quiz
function* requestDeleteQuiz({ payload }) {
  try {
    yield put(deleteQuizRequest());
    yield call(QuizService.removeQuiz, payload);
    yield put(deleteQuizSuccess(payload));
  } catch (err) {
    yield put(deleteQuizFailure(err));
    console.error(err);
  }
}

// delete selected quizzes
function* requestDeleteSelectedQuizzes() {
  try {
    yield put(deleteSelectedQuizzesRequest());
    const res = yield call(QuizService.removeSelectedQuizzes);
    const filteredQuizzes = yield res.json();
    yield put(deleteSelectedQuizzesSuccess(filteredQuizzes));
  } catch (err) {
    yield put(deleteSelectedQuizzesFailure(err));
    console.error(err);
  }
}

// SAGA
export function* adminSaga() {
  yield takeEvery(FETCH_QUIZZES, requestFetchQuizzes);
  yield takeEvery(POST_QUIZ, requestPostQuiz);
  yield takeEvery(EDIT_QUIZ, requestEditQuiz);
  yield takeEvery(SELECT_QUIZ, requestSelectQuiz);
  yield takeEvery(DELETE_QUIZ, requestDeleteQuiz);
  yield takeEvery(DELETE_SELECTED_QUIZZES, requestDeleteSelectedQuizzes);
}

export default reducer;
