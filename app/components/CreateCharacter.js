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

class CreateCharacter extends Component {
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
          userId: this.props.user.id,
          characterName: this.state.characterName,
          clientMutationId: 'mutationId'
        }
      }
    }).then(({ data }) => {
      console.log('got data', data);
    }).catch((error) => {
      console.log('there was an error sending the query', error);
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
const CreateCharacterWithData = graphql(createCharacterMutation)(CreateCharacter);

module.exports = CreateCharacterWithData;

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
