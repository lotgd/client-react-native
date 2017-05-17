// @flow
'use strict';

import React, { Component } from 'react';
import { View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import util from 'util';

import Login from './Login';
import CharacterCreate from './CharacterCreate';
import UserCreate from './UserCreate';
import Home from './Home';
import RealmAdd from './RealmAdd';
import Settings from './Settings';

// For options to pass as StackNavigatorConfig, see
// https://reactnavigation.org/docs/navigators/stack
export default (stackNavigatorConfig: Object) => {
  return StackNavigator({
      Home: { screen: Home },
      UserCreate: { screen: UserCreate },
      CharacterCreate: { screen: CharacterCreate },
      RealmAdd: { screen: RealmAdd },
      Login: { screen: Login },
      Settings: { screen: Settings },
    },
    stackNavigatorConfig);
};
