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

class CharacterCreate extends Component {
  state: {
    loading: boolean,
    characterName: string,
    error: ?string,
    status: ?string,
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      characterName: '',
      error: null,
      status: null,
    };
  }

  onCreate = () => {
    this.setState({
      loading: true,
      error: null,
      status: "Creating character...",
    });

    this.props.mutate({
      variables: {
        input: {
          userId: this.props.realm.session.user.id,
          characterName: this.state.characterName,
          clientMutationId: 'mutationId'
        }
      },
      refetchQueries:[{
        query: gql`
          query UserQuery($id: String!) {
            user(id: $id) {
              characters {
                id,
                name,
                displayName
              }
            }
          }
        `,
        variables: { id: this.props.realm.session.user.id }
      }]
    }).then(({ data }) => {
      console.log('Create character succeeded:', data);

      this.props.navigation.dispatch(NavigationActions.back());
    }).catch((error) => {
      console.log('Error sending create character query:', error);

      this.setState({
        loading: false,
        error: error.message,
        status: null,
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
                titleTextStyleDisabled={ { textAlign: 'center' } }
                title={this.state.status ? this.state.status : 'Create Character'}
              />
            </Section>
          </TableView>
        </RootView>
      );
  }
}

const createCharacterMutation = gql`
  mutation createCharacterMutation($input: CreateCharacterInput!) {
    createCharacter(input: $input) {
      user {
        id,
        characters {
          id,
          name,
          displayName
        }
      },
      character {
        id,
        name,
        displayName
      }
    }
  }
`;

const WrappedCharacterCreate = connect()(graphql(createCharacterMutation)(CharacterCreate));

class CharacterCreateNavigatorShim extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Create Character',
  });

  render() {
    return (
      <ApolloProvider client={this.props.navigation.state.params.realm.apollo}>
        <WrappedCharacterCreate
          {...this.props}
          realm={this.props.navigation.state.params.realm}
        />
      </ApolloProvider>
    );
  }
}

module.exports = CharacterCreateNavigatorShim;

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
