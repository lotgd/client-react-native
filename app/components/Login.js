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
import _ from 'lodash';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { ApolloProvider } from 'react-apollo';

import RootView from './RootView';
import ActionTypes from '../constants/ActionTypes';

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
      console.log('Got login data:', data);

      const session = data['authWithPassword']['session'];
      this.props.dispatch({
        type: ActionTypes.REALM_LOGIN,
        url: this.props.realm.url,
        session: session,
      });

      const action = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'Home' })
        ]
      });
      this.props.navigation.dispatch(action);
    }).catch((error) => {
      console.log('Error logging in:', error);
    });
  }

  onSwitchToSignup = () => {
    this.props.navigation.navigate('CreateUser', { realm: this.props.realm });
  }

  render() {
    return (
      <ApolloProvider client={this.props.realm.apollo}>
        <RootView>
          <KeyboardAvoidingView behavior='padding' style={styles.container}>
            <TextInput
              style={styles.inputBox}
              onChangeText={(email) => this.setState({ email: _.trim(email).toLowerCase() })}
              placeholder='Email'
              keyboardType='email-address'
              autoCapitalize='none'
            />
            <TextInput
              style={styles.inputBox}
              secureTextEntry={true}
              onChangeText={(password) => this.setState({ password: password })}
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
      </ApolloProvider>
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

const WrappedLogin = connect()(graphql(loginMutation)(Login));

class LoginNavigatorShim extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Login',
  });

  render() {
    return (
      <ApolloProvider client={this.props.navigation.state.params.realm.apollo}>
        <WrappedLogin
          {...this.props}
          realm={this.props.navigation.state.params.realm}
          navigation={this.props.navigation}
        />
      </ApolloProvider>
    );
  }
}

module.exports = LoginNavigatorShim;

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
