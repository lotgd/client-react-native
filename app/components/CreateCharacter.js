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
import { connect } from 'react-redux';

import RootView from './RootView';
import ActionTypes from '../constants/ActionTypes';

class CreateCharacter extends Component {
  state: {
    characterName: string
  }

  constructor(props) {
    super(props);
    this.state = {
      characterName: '',
    };
  }

  onCreate = () => {
    this.props.mutate({
      variables: {
        input: {
          userId: this.props.realm._session.user.id,
          characterName: this.state.characterName,
          clientMutationId: 'mutationId'
        }
      }
    }).then(({ data }) => {
      console.log('Create character succeeded:', data);

      this.props.dispatch({
        type: ActionTypes.REALM_CHARACTER_ADD,
        url: this.props.realm.url,
        character: data.createCharacter.character
      });

      this.props.navigator.pop();
    }).catch((error) => {
      console.log('Error sending create character query:', error);
    });
  }

  render() {
    return (
      <RootView>
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
          <TextInput
            style={styles.inputBox}
            onChangeText={(characterName) => this.setState({characterName: characterName})}
            placeholder='Character Name'
          />

          <TouchableHighlight onPress={this.onCreate} style={styles.loginContainer}>
            <View style={styles.loginContent}>
              <Text style={styles.loginContainerText}>
                Create Character
              </Text>
            </View>
          </TouchableHighlight>
        </KeyboardAvoidingView>
      </RootView>
    );
  }
}

const createCharacterMutation = gql`
  mutation createCharacterMutation($input: CreateCharacterInput!) {
    createCharacter(input: $input) {
      user {
        id
      },
      character {
        id,
        name,
        displayName
      }
    }
  }
`;

module.exports = connect()(graphql(createCharacterMutation)(CreateCharacter));

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
