'use strict';

import React, { Component } from 'react';
import {
  Animated,
  StyleSheet,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

class LoadingIndicator extends Component  {
  state = {
    animatedValue: new Animated.Value(0),
  };

  animate() {
    this.state.animatedValue.setValue(0);
    Animated.timing(this.state.animatedValue, {
      toValue: 100,
      duration: 3000,
      easing: (t) => { return t },
    }).start((a) => {
      if (a.finished) {
        this.animate();
      }
    });
  }

  componentDidMount() {
    this.animate();
  }

  render() {
    var interpolatedRotateAnimation = this.state.animatedValue.interpolate({
      inputRange: [0, 100],
      outputRange: ['0deg', '360deg']
    });

    return (
      <Animated.View style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 2, transform: [{ rotate: interpolatedRotateAnimation }] }}>
        <Icon name="loader" size={22} color="#787878" />
      </Animated.View>
    );
  }
}

module.exports = LoadingIndicator;
