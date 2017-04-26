// @flow
'use strict';

import React from 'react';
import { AsyncStorage } from 'react-native';
import { connect, Provider } from 'react-redux';
import { compose, applyMiddleware, createStore } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';

import reducer from './reducers';
import LotGDNavigator from './components/LotGDNavigator';
import RootView from './components/RootView';

global._fetch = fetch;
global.fetch = function(uri, options, ...args) {
  return global._fetch(uri, options, ...args).then((response) => {
    console.log('Fetch', { request: { uri, options, ...args }, response });
    return response;
  });
};

function setup(): ReactClass<{}> {
  const store = createStore(
    reducer,
    undefined,
    compose(
      autoRehydrate()
    )
  );

  // Configure redux-persist to use AsyncStorage as its backing store and
  // begin persisting the store.
  persistStore(store, {
    storage: AsyncStorage,
    // blacklist is set of reducers that don't persist/reload their state.
    blacklist: [ 'banners' ]
  });

  class Root extends React.Component {
    state: {
      realms: Object
    }

    constructor(props) {
      super(props);

      this.state = {
        realms: store.getState().realms
      };
    }

    render() {
      // If there aren't any realms, then start the user on the add realms
      // screen.
      const initialRouteStack = Object.keys(this.state.realms).length > 0 ?
        [{ uri: 'lotgd://app/home' }] :
        [{ uri: 'lotgd://app/home' },
         { uri: 'lotgd://app/realm/add' }];
      return (
        <Provider store={store}>
          <LotGDNavigator initialRouteStack={initialRouteStack}/>
        </Provider>
      );
    }
  }

  return Root;
}

export default setup;
