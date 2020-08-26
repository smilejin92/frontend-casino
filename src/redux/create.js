import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './middlewares/rootSaga';
import reducer from './modules/reducer';
import RouterService from '../services/RouterService';

export default function create() {
  const sagaMiddleWare = createSagaMiddleware();

  const location = RouterService.initRouter();

  const store = createStore(
    reducer,
    {
      router: { ...location },
    },
    composeWithDevTools(applyMiddleware(sagaMiddleWare))
  );

  sagaMiddleWare.run(rootSaga);

  return store;
}
