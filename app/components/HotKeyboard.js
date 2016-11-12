'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

var HotKeyboard = React.createClass({
  render: function() {
    var keys = this.props.keys;
    var renderKey = this._renderKey;
    return (
      <View style={styles.keyboard}>
        {keys.map(function(k) {
          return renderKey(k);
        })}
      </View>
    );
  },

  _renderKey: function(k) {
    return (
      <TouchableOpacity key={k} onPress={this._onPressButton.bind(this, k)}>
        <View style={styles.key}>
          <Text style={styles.hotkey}>
            {k}
            </Text>
        </View>
      </TouchableOpacity>
    );
  },

  _onPressButton: function(k) {
    this.props.onPress(k);
  }
});

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
