// @flow
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
import * as EmailValidator from 'email-validator';
import { connect } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import {
  Cell,
  Section,
  TableView,
} from 'react-native-tableview-simple';

import RootView from './RootView';
import ActionTypes from '../constants/ActionTypes';

class CreateUser extends Component {
  state: {
    name: string,
    email: string,
    password: string,
    error: ?string,
    loading: boolean,
    status: ?string,
  }

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      error: null,
      loading: false,
      status: null
    };
  }

  onSignup = () => {
    const name = _.trim(this.state.name);
    const email = _.trim(this.state.email).toLowerCase();
    const password = this.state.password;

    this.setState({
      loading: true,
      error: null,
      status: 'Creating user...',
    });

    if (name.length == 0) {
      this.setState({
        error: 'You must enter a name.',
        loading: false,
        status: null,
      });
      return;
    }
    if (email.length == 0) {
      this.setState({
        error: 'You must enter an email.',
        loading: false,
        status: null,
      });
      return;
    }
    if (!EmailValidator.validate(email)) {
      this.setState({
        error: 'That doesn\'t look like an email.',
        loading: false,
        status: null,
      });
      return;
    }
    if (password.length == 0) {
      this.setState({
        error: 'You must enter a password.',
        loading: false,
        status: null,
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

      this.setState({
        error: null,
        loading: true,
        status: 'Connecting...',
      });
      // TODO: we should just log people in here.

      this.props.dispatch({
        type: ActionTypes.BANNER_ADD,
        banner: {
          text: 'Successfully created user. Please login.',
          type: 'info',
        }
      });

      this.props.navigation.navigate('Login', { realm: this.props.realm });
    }).catch((error) => {
      console.log('Error creating user: ', error);

      this.setState({
        error: error.message,
        loading: false,
        status: null,
      });
    });
  }

  onSwitchToLogin = () => {
    this.props.navigation.navigate('Login', { realm: this.props.realm });
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
                  Sign up for a new account on {this.props.realm.name}.
                </Text>
              }
              footerComponent={connectError}
              >
              <Cell
                contentContainerStyle={{ alignItems: 'flex-start', height: 44 }}
                cellContentView={
                  <TextInput
                    style={styles.inputBox}
                    keyboardType={'url'}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    onChangeText={(name) => this.setState({name: name})}
                    placeholder='Username'
                  />
                }
              />
              <Cell
                contentContainerStyle={{ alignItems: 'flex-start', height: 44 }}
                cellContentView={
                  <TextInput
                    style={styles.inputBox}
                    onChangeText={(email) => this.setState({email: email})}
                    keyboardType='email-address'
                    autoCapitalize='none'
                    placeholder='Email'
                  />
                }
              />
              <Cell
                contentContainerStyle={{ alignItems: 'flex-start', height: 44 }}
                cellContentView={
                  <TextInput
                    style={styles.inputBox}
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({password: password})}
                    placeholder='Password'
                  />
                }
              />
            </Section>
            <Section
              footerComponent={
                <View style={styles.switchContainer}>
                  <TouchableOpacity onPress={this.onSwitchToLogin}>
                    <Text style={styles.switchText}>{`Already have an account?\nLogin instead.`}
                    </Text>
                  </TouchableOpacity>
                </View>
              }>
              <Cell
                onPress={this.onSignup}
                isDisabled={this.state.loading}
                cellStyle="Basic"
                titleTextColor="#5291F4"
                titleTextStyle={ { textAlign: 'center' } }
                titleTextStyleDisabled={ { textAlign: 'center' } }
                title={this.state.status ? this.state.status : 'Sign Up' }
              />
          </Section>
          </TableView>
        </RootView>
      </ApolloProvider>
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

const WrappedCreateUser = connect()(graphql(createPasswordUser)(CreateUser));

class CreateUserNavigatorShim extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Sign Up',
  });

  render() {
    return (
      <ApolloProvider client={this.props.navigation.state.params.realm.apollo}>
        <WrappedCreateUser
          {...this.props}
          realm={this.props.navigation.state.params.realm}
          navigation={this.props.navigation}
        />
      </ApolloProvider>
    );
  }
}

module.exports = CreateUserNavigatorShim;

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
