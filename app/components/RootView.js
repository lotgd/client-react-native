'use strict';
import React, {
  StyleSheet,
  View,
} from 'react-native';

var BannerView = require('./BannerView');
var BannerStore = require('../stores/BannerStore');

function getRootState() {
  return {
    banners: BannerStore.getAll()
  };
}

var RootView = React.createClass({
  getInitialState: function() {
    return getRootState();
  },

  componentDidMount: function() {
    BannerStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    BannerStore.removeChangeListener(this._onChange);
  },

  render: function() {
    return (
      <View style={styles.container}>
        <BannerView banners={this.state.banners}/>
        {this.props.children}
      </View>
    );
  },

  _onChange: function() {
    this.setState(getRootState());
  }
});

module.exports = RootView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
});
