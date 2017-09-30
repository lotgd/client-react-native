'use strict';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  StatusBar,
} from 'react-native';
import { connect } from 'react-redux'

class RootView extends Component {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        {this.props.children}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  banners: state.banners
});

export default RootView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFF4',
  },
});
