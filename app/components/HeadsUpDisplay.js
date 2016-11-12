'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

var HeadsUpDisplay = React.createClass({
  render: function() {
    var values = this.props.values;
    var renderGroup = this._renderGroup;
    return (
    <View style={styles.hud}>
      {Object.keys(values).map(function(k, index) {
        if (index > 3) {
          return null;
        }
        var v = values[k];
        return renderGroup(k, v);
      })}
    </View>
    );
  },

  _renderGroup: function(label, value) {
    return (
      <View key={label} style={styles.hudGroup}>
        <Text style={styles.hudValue}>{value}</Text>
        <Text style={styles.hudLabel}>{label}</Text>
      </View>
    );
  }
});

module.exports = HeadsUpDisplay;

const styles = StyleSheet.create({
  hud: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 34,
    borderTopColor: '#979797',
    borderTopWidth: 1,
    borderBottomColor: '#C7C7C7',
    borderBottomWidth: 1,
    padding: 5,
  },

  hudGroup: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  hudValue: {
    color: '#787878',
    fontSize: 14,
  },

  hudLabel: {
    marginLeft: 2,
    color: '#787878',
    fontSize: 12,
  }
});
