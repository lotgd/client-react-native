'use strict';
import React, {
  StyleSheet,
  View,
  Text,
} from 'react-native';

var BannerView = React.createClass({
  propTypes: {
    banners: React.PropTypes.object,
    timeout: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      timeout: 5000
    };
  },

  _getHorizon: function() {
    return (new Date()).getTime() - this.props.timeout;
  },

  getInitialState: function() {
    return {
      horizon: this._getHorizon()
    };
  },

  _setTimer: function() {
    setTimeout(function() {
      this.setState({
        horizon: this._getHorizon()
      })
    }.bind(this), this.props.timeout);
  },

  componentDidMount: function() {
     this._setTimer();
   },

  componentWillReceiveProps: function() {
    this._setTimer();
  },

  render: function() {
    let banners = Array.from(Object.keys(this.props.banners), k => {
      let b = this.props.banners[k];

      // Ignore expired banners. TODO: add animation.
      if (b.timestamp < this.state.horizon) {
        return null;
      }
      return (
        <Text key={b.id} style={styles[b['type']]}>{b.text}</Text>
      );
    });
    return (
      <View style={styles.container}>
        {banners}
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0
  },
  error: {
    backgroundColor: '#E53935',
    textAlign: 'center',
    color: '#FFF',
    paddingTop: 7,
    paddingBottom: 7,
  },
  info: {
    backgroundColor: '#424242',
    textAlign: 'center',
    color: '#FFF',
    paddingTop: 7,
    paddingBottom: 7,
  },
});

module.exports = BannerView;
