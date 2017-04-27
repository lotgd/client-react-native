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

class CreateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
    };
  }

  onSignup = () => {
    this.props.mutate({
      variables: {
        input: {
          name: this.state.name,
          email: this.state.email,
          password: this.state.password,
          clientMutationId: 'mutationId'
        }
      }
    }).then(({ data }) => {
      console.log('got data', data);
    }).catch((error) => {
      console.log('there was an error sending the query', error);
    });
  }

  onSwitchToLogin = () => {
    this.props.navigator.resetTo({
      uri: 'lotgd://app/login',
      realm: this.props.realm
    });
  }

  render() {
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
const CreateUserWithData = graphql(createPasswordUser)(CreateUser);

module.exports = CreateUserWithData;

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
