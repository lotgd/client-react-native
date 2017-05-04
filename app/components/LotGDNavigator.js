// @flow
'use strict';

import React, { Component } from 'react';
import { View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import util from 'util';

import Login from './Login';
import CreateCharacter from './CreateCharacter';
import CreateUser from './CreateUser';
import Home from './Home';
import RealmAdd from './RealmAdd';

// For options to pass as StackNavigatorConfig, see
// https://reactnavigation.org/docs/navigators/stack
export default (stackNavigatorConfig: Object) => {
  return StackNavigator({
      Home: { screen: Home },
      CreateUser: { screen: CreateUser },
      CreateCharacter: { screen: CreateCharacter },
      RealmAdd: { screen: RealmAdd },
      Login: { screen: Login },
    },
    stackNavigatorConfig);
};
