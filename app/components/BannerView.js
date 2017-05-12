'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

class BannerView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      horizon: this._getHorizon()
    };
  }

  _getHorizon = () => {
    return (new Date()).getTime() - this.props.timeout;
  }

  _setTimer = () => {
    setTimeout(function() {
      this.setState({
        horizon: this._getHorizon()
      })
    }.bind(this), this.props.timeout);
  }

  componentWillReceiveProps() {
    this._setTimer();
  }

  render() {
    let banners = Array.from(Object.keys(this.props.banners), k => {
      if (k == 'counter') {
        return null;
      }

      let b = this.props.banners[k];

      // Ignore expired banners. TODO: add animation.
      if (b.timestamp < this.state.horizon) {
        return null;
      }

      console.log(JSON.stringify(b));

      return (
        <Text key={k} style={styles[b['type']]}>{b.text}</Text>
      );
    });
    return (
      <View style={styles.container}>
        {banners}
      </View>
    );
  }
};
BannerView.propTypes = {
  banners: React.PropTypes.object.isRequired,
  timeout: React.PropTypes.number,
};
BannerView.defaultProps = {
  timeout: 5000,
}

export default BannerView;

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
