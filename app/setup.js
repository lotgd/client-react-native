// @flow
'use strict';

import React from 'react';
import { AsyncStorage, View, Text } from 'react-native';
import { connect, Provider } from 'react-redux';
import { compose, applyMiddleware, createStore } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import util from 'util';

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

  class Root extends React.Component {
    state: {
      loading: boolean,
      realms: ?Object
    }

    constructor(props) {
      super(props);

      this.state = {
        loading: true,
        realms: null
      };

      // Configure redux-persist to use AsyncStorage as its backing store and
      // begin persisting/reading the store.
      persistStore(
        store,
        {
          storage: AsyncStorage,
          // blacklist is set of reducers that don't persist/reload their state.
          blacklist: [ 'banners' ]
        },
        () => {
          console.log('Redux store rehydration complete:', util.inspect(store.getState()));

          this.setState({
            loading: false,
            realms: store.getState().realms
          });
        }
      );
    }

    render() {
      if (this.state.loading) {
        return (
          <View>
            <Text>Loading</Text>
          </View>
        );
      } else if (this.state.realms) {
        // If there aren't any realms, then start the user on the add realms
        // screen.
        const initialRoute = Object.keys(this.state.realms).length > 0 ?
          'Home' :
          'RealmAdd';
        const LotGDNavigatorComponent = LotGDNavigator({
          initialRouteName: initialRoute
        });
        return (
          <Provider store={store}>
            <LotGDNavigatorComponent />
          </Provider>
        );
      } else {
        console.error('null realms object on startup');
      }
    }
  }

  return Root;
}

export default setup;
