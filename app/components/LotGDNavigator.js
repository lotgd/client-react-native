// @flow
'use strict';

import React, { Component } from 'react';
import {
  Navigator,
  View,
} from 'react-native';

import Login from './Login';
//import AddRealm from './AddRealm';
import CreateCharacter from './CreateCharacter';
import CreateUser from './CreateUser';
import Home from './Home';
import AddRealm from './AddRealm';
import { ApolloClient, ApolloProvider } from 'react-apollo';

class LotGDNavigator extends Component {
  render() {
    return (
      <Navigator
        initialRouteStack={this.props.initialRouteStack}
        renderScene={this.renderScene}
      />
    );
  }

  renderScene(route : Object, navigator : Navigator) {
    console.log("Navigating to " + route.uri);

    switch (route.uri) {
      case 'lotgd://app/realm/login':
        return (
          <Login navigator={navigator}/>
        );
      case 'lotgd://app/realm/add':
        return (
          <AddRealm
            navigator={navigator}
          />
        );
      case 'lotgd://app/realm/create-character':
        return (
          <CreateCharacter navigator={navigator}/>
        );
      case 'lotgd://app/realm/create-user':
        return (
          <ApolloProvider client={route.realm.apollo}>
            <CreateUser navigator={navigator}/>
          </ApolloProvider>
        );
      case 'lotgd://app/home':
        return (
          <Home
            navigator={navigator}
            session={route.session}/>
        );
      case 'lotgd://app/notifications':
      case 'lotgd://app/messages':
      case 'lotgd://app/realm/messages':
      case 'lotgd://app/realm/play':
      case 'lotgd://app/realm/new-character':
    }
  }
}

module.exports = LotGDNavigator;
