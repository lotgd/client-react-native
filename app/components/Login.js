'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableHighlight,
  KeyboardAvoidingView,
} from 'react-native';

var RootView = require('./RootView');
var LotGDActions = require('../actions/LotGDActions');

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  onLogin = () => {
    
  }

  render() {
    return (
      <RootView>
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
          <TextInput
            style={styles.inputBox}
            onChangeText={(username) => this.setState({username: username})}
            placeholder='Username'
          />
          <TextInput
            style={styles.inputBox}
            secureTextEntry={true}
            onChangeText={(password) => this.setState({password: password})}
            placeholder='Password'
          />

          <TouchableHighlight onPress={this.onLogin} style={styles.loginContainer}>
            <View style={styles.loginContent}>
              <Text style={styles.loginContainerText}>
                Login
              </Text>
            </View>
          </TouchableHighlight>
        </KeyboardAvoidingView>
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
  inputBox: {
    height: 40,
    paddingLeft: 10,
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
});
