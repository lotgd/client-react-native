'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View, } from 'react-native';
import _ from 'lodash';

class HeadsUpDisplay extends Component {
  render() {
    const values = _.map(this.props.values, function(value, key) {
        return (
          <View key={key} style={styles.hudGroup}>
            <Text style={styles.hudValue}>{value}</Text>
            <Text style={styles.hudLabel}>{key}</Text>
          </View>
        )
    });

    return (
      <View style={styles.hud}>
        {values}
      </View>
    );
  }
}

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
