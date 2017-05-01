// @flow
'use strict';

import React, { Component } from 'react';
import {
  Navigator,
  View,
} from 'react-native';
import util from 'util';
import { ApolloClient, ApolloProvider } from 'react-apollo';

import Login from './Login';
import CreateCharacter from './CreateCharacter';
import CreateUser from './CreateUser';
import Home from './Home';
import RealmAdd from './RealmAdd';

class LotGDNavigator extends Component {
  render() {
    return (
      <Navigator
        initialRoute={this.props.initialRoute}
        renderScene={this.renderScene}
      />
    );
  }

  renderScene(route: Object, navigator: Navigator) {
    console.log("Navigating to " + util.inspect(route));

    switch (route.uri) {
      case 'lotgd://app/realm/login':
        return (
          <ApolloProvider client={route.realm.apollo}>
            <Login
              navigator={navigator}
              realm={route.realm}/>
          </ApolloProvider>
        );
      case 'lotgd://app/realm/add':
        return (
          <RealmAdd navigator={navigator}/>
        );
      case 'lotgd://app/realm/create-character':
        return (
          <ApolloProvider client={route.realm.apollo}>
            <CreateCharacter
              navigator={navigator}
              realm={route.realm}/>
          </ApolloProvider>
        );
      case 'lotgd://app/realm/create-user':
        return (
          <ApolloProvider client={route.realm.apollo}>
            <CreateUser
              navigator={navigator}
              realm={route.realm}/>
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
