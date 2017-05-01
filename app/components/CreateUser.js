// @flow
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
import * as EmailValidator from 'email-validator';
import { connect } from 'react-redux';

import RootView from './RootView';
import ActionTypes from '../constants/ActionTypes';

class CreateUser extends Component {
  state: {
    name: string,
    email: string,
    password: string,
    error: ?string,
  }

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      error: null,
    };
  }

  onSignup = () => {
    const name = _.trim(this.state.name);
    const email = _.trim(this.state.email).toLowerCase();
    const password = this.state.password;

    if (name.length == 0) {
      this.setState({
        error: 'You must enter a name.',
      });
      return;
    }
    if (email.length == 0) {
      this.setState({
        error: 'You must enter an email.',
      });
      return;
    }
    if (!EmailValidator.validate(email)) {
      this.setState({
        error: 'That doesn\'t look like an email.',
      });
      return;
    }
    if (password.length == 0) {
      this.setState({
        error: 'You must enter a password.'
      });
      return;
    }

    this.props.mutate({
      variables: {
        input: {
          name: name,
          email: email,
          password: password,
          clientMutationId: 'mutationId',
        }
      }
    }).then(({ data }) => {
      // TODO: should check for errors.

      console.log('Successfully created user: ', data);

      this.props.dispatch({
        type: ActionTypes.BANNER_ADD,
        banner: {
          text: 'Successfully created user. Please login.',
          type: 'info',
        }
      });

      this.props.navigator.replace({
        uri: 'lotgd://app/realm/login',
        realm: this.props.realm,
      });
    }).catch((error) => {
      console.log(JSON.stringify(error));
      console.log('Error creating user: ', error);

      this.props.dispatch({
        type: ActionTypes.BANNER_ADD,
        banner: {
          text: 'Error creating user!',
          type: 'error',
        }
      });
    });
  }

  onSwitchToLogin = () => {
    this.props.navigator.resetTo({
      uri: 'lotgd://app/realm/login',
      realm: this.props.realm,
    });
  }

  render() {
    const errorText = this.state.error ? <Text>{ this.state.error }</Text> : null;

    return (
      <RootView>
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
          <TextInput
            style={styles.inputBox}
            onChangeText={(name) => this.setState({name: name})}
            autoCorrect={false}
            autoCapitalize='none'
            placeholder='Username'
          />
          <TextInput
            style={styles.inputBox}
            onChangeText={(email) => this.setState({email: email})}
            keyboardType='email-address'
            autoCapitalize='none'
            placeholder='Email'
          />
          <TextInput
            style={styles.inputBox}
            secureTextEntry={true}
            onChangeText={(password) => this.setState({password: password})}
            placeholder='Password'
          />
          { errorText }
          <TouchableHighlight onPress={this.onSwitchToLogin}>
            <Text>
              Already have an account? Login instead.
            </Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={this.onSignup} style={styles.loginContainer}>
            <View style={styles.loginContent}>
              <Text style={styles.loginContainerText}>
                Signup
              </Text>
            </View>
          </TouchableHighlight>
        </KeyboardAvoidingView>
      </RootView>
    );
  }
}

const createPasswordUser = gql`
  mutation createPasswordUser($input: CreatePasswordUserInput!) {
    createPasswordUser(input: $input) {
      clientMutationId
    }
  }
`;

module.exports = connect()(graphql(createPasswordUser)(CreateUser));

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
