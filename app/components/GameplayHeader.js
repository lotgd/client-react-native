'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import _ from 'lodash';

class GameplayHeader extends Component  {
  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.header }>
        <TouchableOpacity onPress={() => { this.props.onBack() }}>
          <Text style={ styles.back }>{ this.props.back }</Text>
        </TouchableOpacity>
        <Text style={ styles.title }>{ this.props.title }</Text>
        </View>
      </View>
    );
  }
}

export default GameplayHeader;

const styles = StyleSheet.create({
  container: {
    height: 64,
  },
  header: {
    padding: 15,
    flexDirection: 'row',
  },
  back: {
    fontSize: 17,
    color: '#037AFF',
  },
  title: {
    fontSize: 17,
    color: '#030303',
    fontWeight: '500',
    position: 'absolute',
    textAlign: 'center',
    top: 15,
    left: 70,
    right: 70,
    bottom: 0,
  },
});
