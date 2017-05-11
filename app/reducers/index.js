// @flow
'use strict';

import { combineReducers } from 'redux';
import ActionTypes from '../constants/ActionTypes';
import realms from './realms';
import banners from './banners';

// Each of these reducers is a function that processes changes to the app state.
// They are named to correspond with the keys within the state object, so
// the realms() function will operate on the state.realms object.
// See http://redux.js.org/docs/recipes/reducers/UsingCombineReducers.html
const combinedReducer = combineReducers({
  realms,
  banners,
});

function purgeReducer(state, action) {
  switch(action.type) {
    case ActionTypes.PURGE:
      return {};
    default:
      return state;
  }
}

export default function(state, action) {
  const possiblyPurgedState = purgeReducer(state, action);
  return combinedReducer(possiblyPurgedState, action);
};
