// @flow
'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
} from 'react-native';
import { gql, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import { NavigationActions } from 'react-navigation';
import {
  Cell,
  Section,
  TableView,
} from 'react-native-tableview-simple';

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
      error: null,
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

      this.props.navigation.dispatch(NavigationActions.back());
    }).catch((error) => {
      console.log('Error sending create character query:', error);

      this.setState({
        error: error.message
      })
    });
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
                  Create a new character on {this.props.realm.name}.
                </Text>
              }
              footerComponent={connectError}
              >
              <Cell
                contentContainerStyle={{ alignItems: 'flex-start', height: 44 }}
                cellContentView={
                  <TextInput
                    style={styles.inputBox}
                    onChangeText={(characterName) => this.setState({characterName: characterName})}
                    placeholder='Character Name'
                    autoCorrect={false}
                    autoCapitalize='none'
                  />
                }
              />
            </Section>
            <Section>
              <Cell
                onPress={this.onCreate}
                isDisabled={this.state.loading}
                cellStyle="Basic"
                titleTextColor="#5291F4"
                titleTextStyle={ { textAlign: 'center' } }
                title="Create Character"
              />
            </Section>
          </TableView>
        </RootView>
      </ApolloProvider>
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

const WrappedCreateCharacter = connect()(graphql(createCharacterMutation)(CreateCharacter));

class CreateCharacterNavigatorShim extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Create Character',
  });

  render() {
    return (
      <ApolloProvider client={this.props.navigation.state.params.realm.apollo}>
        <WrappedCreateCharacter
          {...this.props}
          realm={this.props.navigation.state.params.realm}
          navigation={this.props.navigation}
        />
      </ApolloProvider>
    );
  }
}

module.exports = CreateCharacterNavigatorShim;

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
});
