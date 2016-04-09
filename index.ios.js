'use strict';
import React, {
  AppRegistry,
  Component,
  Navigator,
} from 'react-native';

var Login = require('./app/components/Login');

class LotGD extends Component {
  render() {
    return (
      <Navigator
        initialRoute={{uri: 'lotgd://app/bootstrap', index: 0}}
        renderScene={function f(route, navigator) {
          switch (route.uri) {
            case 'lotgd://app/bootstrap':
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
        }}
        />
      );
  }
}

AppRegistry.registerComponent('LotGD', () => LotGD);
