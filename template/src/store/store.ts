import createSagaMiddleware from 'redux-saga';
import { applyMiddleware, createStore } from 'redux';

import { rootReducer } from './rootReducer';
import { rootSaga } from './rootSaga';
import { api } from '../API';

const sagaMiddleware = createSagaMiddleware({
  context: {
    api,
  },
});

export const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);
