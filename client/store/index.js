import {createStore, combineReducers, applyMiddleware} from 'redux';
import {createLogger} from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import user from './user';
import teams from './teams';
import assignment from './assignment';
import routine from './routine';
import practice from './practice';

const reducer = combineReducers({user, teams, assignment, routine, practice});
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
);
const store = createStore(reducer, middleware);

export default store;
export * from './user';
export * from './teams';
export * from './routine';
export * from './practice';
export * from './assignment';
