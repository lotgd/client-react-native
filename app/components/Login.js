'use strict';
import React, {
  Component,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} from 'react-native';

var RootView = require('./RootView');
var SessionManager = require('../stores/SessionManager');
var LotGDActions = require('../actions/LotGDActions');

var Login = React.createClass({
  onLogin: function() {
    if (Math.random() > .5) {
      LotGDActions.addBanner('Something informational', 'info');
    } else {
      LotGDActions.addBanner('Something went wrong with login to Facebook.', 'error');
    }
    return;
    SessionManager.loginToFacebook()
                  .catch(LotGDActions.addBanner('Something went wrong with login to Facebook.', 'error'))
                  .then(SessionManager.loginToNexus())
                  .catch(LotGDActions.addBanner('Something went wrong with login to the LoGD server.', 'error'))
                  .then(this.props.navigator.resetTo('lotgd://app/home'));
  },

  render: function() {
    return (
      <RootView>
        <View style={styles.container}>
          <Text style={styles.instructions}>
            A red-headed young man stops you at the gate.
            Asking for your papers, he assures you they won’t be used except
            here at this way station. No one inside will see them.
          </Text>
          <TouchableHighlight onPress={this.onLogin} style={styles.loginContainer}>
            <View style={styles.loginContent}>
              <Image style={styles.loginFBIcon} source={require('../../assets/FB-f-Logo__white_50.png')} />
              <Text style={styles.loginContainerText}>
                Login with Facebook
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </RootView>
    );
  }
});

module.exports = Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  instructions: {
    textAlign: 'center',
    color: '#787878',
    marginBottom: 15,
    marginLeft: 52,
    marginRight: 52,
  },
  loginContent: {
    flexDirection: 'row',
  },
  loginContainer: {
    flexDirection: 'row',
    backgroundColor: '#4267B2',
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
  },
  loginContainerText: {
    color: 'white',
  },
  loginFBIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
  },
});
