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
import { gql, graphql } from 'react-apollo';

import RootView from './RootView';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  onLogin = () => {
    this.props.mutate({
      variables: {
        input: {
          email: this.state.email,
          password: this.state.password,
          clientMutationId: 'mutationId'
        }
      }
    }).then(({ data }) => {
      console.log('got data', data);

      const session = data['authWithPassword']['session'];
      let sessionSave = global.storage.save({
        key: 'session',
        rawData: session
      });

      return sessionSave;
    }).then(() => {
      this.props.navigator.resetTo('lotgd://app/home');
    }).catch((error) => {
      console.log('there was an error logging in:', error);
    });
  }

  onSwitchToSignup = () => {
    this.props.navigator.resetTo({ uri: 'lotgd://app/realm/create-user' });
  }

  render() {
    return (
      <RootView>
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
          <TextInput
            style={styles.inputBox}
            onChangeText={(email) => this.setState({email: email})}
            placeholder='Email'
          />
          <TextInput
            style={styles.inputBox}
            secureTextEntry={true}
            onChangeText={(password) => this.setState({password: password})}
            placeholder='Password'
          />
          <TouchableHighlight onPress={this.onSwitchToSignup}>
            <Text>
              Don't have an account? Signup.
            </Text>
          </TouchableHighlight>

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

const loginMutation = gql`
  mutation AuthWithPasswordMutation($input: AuthWithPasswordInput!) {
    authWithPassword(input: $input) {
      session {
          apiKey,
          expiresAt,
          user {
              id,
              name
          }
      },
      clientMutationId
    }
  }
`;
const LoginWithData = graphql(loginMutation)(Login);

module.exports = LoginWithData;

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
