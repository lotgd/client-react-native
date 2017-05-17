'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import _ from 'lodash';

class HotKeyboard extends Component  {
  render() {
    const onPressButton = this._onPressButton;
    const keys = _.map(this.props.keys, function(k) {
      return (
        <TouchableOpacity key={k.key} onPress={() => { onPressButton(k) }}>
          <View style={styles.key}>
            <Text style={styles.hotkey}>
              {k.key}
            </Text>
          </View>
        </TouchableOpacity>
      );
    });

    return (
      <View style={styles.keyboard}>
        { keys }
      </View>
    );
  }

  _onPressButton = (k) => {
    this.props.onPress(k);
  }
}

module.exports = HotKeyboard;

const styles = StyleSheet.create({
  keyboard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#E0E0E0',
    alignItems: 'flex-start',
    padding: 5,
  },
  hotkey: {
    textAlign: 'center',
  },
  key: {
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    alignItems: 'stretch',
    margin: 5,
    width: 40,
    height: 40,
    borderRadius: 11,
    shadowColor: '#9B9B9B',
    shadowOpacity: 0.5,
    shadowRadius: 0,
    shadowOffset: {
      width: 0,
      height: 2.5,
    },
  },
});
