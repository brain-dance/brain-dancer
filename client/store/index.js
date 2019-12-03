import {createStore, combineReducers, applyMiddleware} from 'redux';
import {createLogger} from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import user from './user';
import teams from './teams';
import assignments from './assignment';
import singleRoutine from './singleRoutine';
import practice from './practice';
import users from './users';

const reducer = combineReducers({
  user,
  teams,
  assignments,
  singleRoutine,
  practice,
  users
});
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
);
const store = createStore(reducer, middleware);

export default store;
export * from './user';
export * from './users';
export * from './teams';
export * from './singleRoutine';
export * from './practice';
export * from './assignment';
export * from './routine';
