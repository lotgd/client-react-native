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

      this.props.navigation.navigate('Login', { realm: this.props.realm });
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
                  Create a user on {this.props.realm.name}.
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
                title="Signup"
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
    title: 'Create User',
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
