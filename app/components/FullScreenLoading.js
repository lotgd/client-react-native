'use strict';

import React, { Component } from 'react';
import {
  Animated,
  StyleSheet,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import LoadingIndicator from './LoadingIndicator';
import RootView from './RootView';

class FullScreenLoading extends Component  {
  render() {
    return (
      <RootView>
        <View style={styles.container}>
          <LoadingIndicator/>
        </View>
      </RootView>
    );
  }
}

module.exports = FullScreenLoading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
