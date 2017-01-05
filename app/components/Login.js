'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableHighlight,
} from 'react-native';

var RootView = require('./RootView');
var LotGDActions = require('../actions/LotGDActions');

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'Username',
      password: 'Password'
    };
  }

  onLogin() {
    // SessionManager.loginToFacebook()
    //               .catch(LotGDActions.addBanner('Something went wrong with login to Facebook.', 'error'))
    //               .then(SessionManager.loginToNexus())
    //               .catch(LotGDActions.addBanner('Something went wrong with login to the LotGD server.', 'error'))
    //               .then(this.props.navigator.resetTo('lotgd://app/home'));
  }

  render() {
    return (
      <RootView>
        <View style={styles.container}>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(username) => this.setState({username})}
            value={this.state.username}
          />
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
          />

          <TouchableHighlight onPress={this.onLogin} style={styles.loginContainer}>
            <View style={styles.loginContent}>
              <Text style={styles.loginContainerText}>
                Login
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </RootView>
    );
  }
}

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
