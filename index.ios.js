'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  Navigator,
  View,
} from 'react-native';

import HeadsUpDisplay from './app/components/HeadsUpDisplay';
import HotKeyboard from './app/components/HotKeyboard';

var SceneContent = React.createClass({
    render() {
        return (
            <View/>
        );
    }
});

class LotGD extends Component {
  render() {
    return (
      <Navigator
        initialRoute={{uri: 'lotgd://app/bootstrap', index: 0}}
        renderScene={function f(route, navigator) {
          switch (route.uri) {
            case 'lotgd://app/bootstrap':
              return (
                  <View style={{flex: 1}}>
                    <SceneContent

                    />
                    <HeadsUpDisplay
                      values={{
                        'HP': '19/20',
                        'TURNS': '13',
                        'GOLD': '158',
                        'EXP': '519/1000',
                      }}/>
                    <HotKeyboard
                      keys={['n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']}
                      onPress={function(k) {console.log(k);}}/>
                  </View>
              );
              break;
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
