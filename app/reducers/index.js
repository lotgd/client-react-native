// @flow
'use strict';

import { combineReducers } from 'redux';
import realms from './realms';
import banners from './banners';

// Each of these reducers is a function that processes changes to the app state.
// They are named to correspond with the keys within the state object, so
// the realms() function will operate on the state.realms object.
// See http://redux.js.org/docs/recipes/reducers/UsingCombineReducers.html
const rootReducer = combineReducers({
  realms,
  banners,
});

export default rootReducer;
