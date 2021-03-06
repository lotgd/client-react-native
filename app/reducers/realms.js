//@flow
'use strict';

import ActionTypes from '../constants/ActionTypes';
import { REHYDRATE } from 'redux-persist/constants';
import { RealmBindApollo } from '../helpers/Realm';

export default function realms(state: Object = {}, action: Object) {
  switch (action.type) {
    case REHYDRATE:
      // When loading state from disk, create and bind Apollo clients
      // to each realm.
      var incoming = action.payload.realms;
      if (incoming) {
        var bounds = {};
        for (var url in incoming) {
          bounds[url] = RealmBindApollo(url, incoming[url]);
        }
        return { ...state, ...bounds };
      } else {
        return state;
      }

    case ActionTypes.REALM_LOGIN:
      var r = state[action.url];
      if (r) {
        // Rebind the Apollo client now that the token has changed.
        return {
          ...state,
          [action.url]: RealmBindApollo(action.url, {
            ...r,
              session: action.session,
          }),
        };
      } else {
        // TODO: we should handle errors in reducers somehow.
        return state;
      }

    case ActionTypes.REALM_ADD:
      return {
        [action.url]: {
          ...action.realm,
          url: action.url,
        },
        ...state
      };

    case ActionTypes.REALM_DELETE:
      var s = { ...state };
      delete s[action.url];
      return s;

    default:
      return state;
  }
};
