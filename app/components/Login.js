'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { gql, graphql } from 'react-apollo';
import _ from 'lodash';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { ApolloProvider } from 'react-apollo';
import {
  Cell,
  Section,
  TableView,
} from 'react-native-tableview-simple';

import RootView from './RootView';
import ActionTypes from '../constants/ActionTypes';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: null,
    };
  }

  onLogin = () => {
    const email = _.trim(this.state.email).toLowerCase();
    const password = this.state.password;

    if (email.length == 0) {
      this.setState({
        error: 'You must enter an email.',
      });
      return;
    }
    if (password.length == 0) {
      this.setState({
        error: 'You must enter a password.',
      });
      return;
    }

    // For now, clear any error state.
    this.setState({
      error: null
    });

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

      this.setState({
        error: error.message,
      });
    });
  }

  onSwitchToSignup = () => {
    this.props.navigation.navigate('CreateUser', { realm: this.props.realm });
  }

  render() {
    var connectError = this.state.error ? (
      <Text style={styles.connectError}>
        { this.state.error }
      </Text>
    ) : null;

    return (
      <ApolloProvider client={this.props.realm.apollo}>
        <RootView>
          <TableView>
            <Section
              headerComponent={
                <Text style={styles.header}>
                  Login with an existing user on {this.props.realm.name}.
                </Text>
              }
              footerComponent={connectError}
              >
              <Cell
                contentContainerStyle={{ alignItems: 'flex-start', height: 44 }}
                cellContentView={
                  <TextInput
                    style={styles.inputBox}
                    onChangeText={(email) => this.setState({ email: email })}
                    autoCorrect={false}
                    placeholder='Email'
                    keyboardType='email-address'
                    autoCapitalize='none'
                  />
                }
              />
              <Cell
                contentContainerStyle={{ alignItems: 'flex-start', height: 44 }}
                cellContentView={
                  <TextInput
                    style={styles.inputBox}
                    onChangeText={(password) => this.setState({ password: password })}
                    placeholder='Password'
                    secureTextEntry={true}
                  />
                }
              />
            </Section>
            <Section
              footerComponent={
                <View style={styles.switchContainer}>
                  <TouchableOpacity onPress={this.onSwitchToSignup}>
                    <Text style={styles.switchText}>Don't have an account? Signup.</Text>
                  </TouchableOpacity>
                </View>
              }>
              <Cell
                onPress={this.onLogin}
                isDisabled={this.state.loading}
                cellStyle="Basic"
                titleTextColor="#5291F4"
                titleTextStyle={ { textAlign: 'center' } }
                title="Login"
              />
            </Section>
          </TableView>
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
  header: {
    color: '#787878',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 20,
    paddingBottom: 10,
    textAlign: 'center',
  },
  inputBox: {
    height: 44,
    flex: 1,
  },
  connectError: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    textAlign: 'center',
    color: 'red',
  },
  switchContainer: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 20,
    paddingBottom: 10,
  },
  switchText: {
    color: '#5291F4',
    textAlign: 'center',
  }
});
