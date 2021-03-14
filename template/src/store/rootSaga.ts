import { takeLatest } from 'redux-saga/effects';

export const rootSaga = function* () {
  yield takeLatest('TEST', () => {
    console.log('test');
  });
};
