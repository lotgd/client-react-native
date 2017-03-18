// @flow
'use strict';

import React, { Component } from 'react';
import {
  Navigator,
  View,
} from 'react-native';

import Bootstrap from './Bootstrap';
import Login from './Login';

class LotGDNavigator extends Component {
  render() {
    return (
      <Navigator
        initialRoute={{ uri: 'lotgd://app/bootstrap' }}
        renderScene={this.renderScene}
      />
    );
  }

  renderScene(route : Object, navigator : Navigator) {
    switch (route.uri) {
      case 'lotgd://app/bootstrap':
        return (
          <Bootstrap navigator={navigator}/>
        );
      case 'lotgd://app/login':
        return (
          <Login/>
        );
      case 'lotgd://app/home':
      case 'lotgd://app/notifications':
      case 'lotgd://app/messages':
      case 'lotgd://app/realm/messages':
      case 'lotgd://app/realm/play':
      case 'lotgd://app/realm/new-character':
    }
  }
}

module.exports = LotGDNavigator;
