// @flow
'use strict';

import React from 'react';
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface
} from 'react-apollo';
import { AsyncStorage } from 'react-native';
import Storage from 'react-native-storage';

import LotGD from './LotGD';

function setup(): ReactClass<{}> {
  const storage = new Storage({
    // maximum capacity, default 1000
    size: 1000,

    // Use AsyncStorage for RN, or window.localStorage for web.
    // If not set, data would be lost after reload.
    storageBackend: AsyncStorage,

    // expire time, default 1 day(1000 * 3600 * 24 milliseconds).
    // can be null, which means never expire.
    defaultExpires: null,

    // cache data in the memory. default is true.
    enableCache: true,
  });

  global.storage = storage;

  const networkInterface = createNetworkInterface({
    uri: '/graphql',
  });

  networkInterface.use([{
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {};  // Create the header object if needed.
      }
      // get the authentication token from local storage if it exists
      storage.load({
        key: 'token'
      }).then(ret => {
        req.options.headers.authorization = ret.token ? `Bearer ${ret.token}` : null;
        next();
      }).catch(err => {
        console.warn(err.message);
        next();
      })
    }
  }]);

  const client = new ApolloClient({
    networkInterface,
  });

  class Root extends React.Component {
    render() {
      return (
        <ApolloProvider client={client}>
          <LotGD />
        </ApolloProvider>
      );
    }
  }

  return Root;
}

module.exports = setup;
