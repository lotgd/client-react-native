// @flow
'use strict';
import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ListView,
  Button,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import {
  Cell,
  Section,
  TableView,
} from 'react-native-tableview-simple';
import { gql, graphql } from 'react-apollo';
import { ApolloProvider } from 'react-apollo';
import { connect } from 'react-redux';
import _ from 'lodash';
import util from 'util';
import Icon from 'react-native-vector-icons/Ionicons';

const CreateNewCharacterModel = { displayName: 'Create new character', id: '-1' };
const RefreshInterval = 1000*60*60*3; // Three hours in milliseconds

class CharacterList extends Component {
  _onPress = (model: Object) => {
    if (model.id == CreateNewCharacterModel.id) {
      this.props.navigation.navigate('CharacterCreate', { realm: this.props.realm });
    } else {
      this.props.navigation.navigate('Gameplay', { realm: this.props.realm, characterId: model.id });
    }
  }

  _characterCells = () => {
    const characterModels = [
      ...this.props.data.user.characters,
      CreateNewCharacterModel,
    ];
    return _.map(characterModels, (character) => {
      return (
        <Cell
          key={character.displayName}
          onPress={() => {
            this._onPress(character);
          }}
          cellStyle="Basic"
          accessory="DisclosureIndicator"
          title={character.displayName}
        />
      );
    });
  }

  render() {
    if (this.props.data.loading) {
      return (
        <Section
          header={this.props.realm.name ? this.props.realm.name : 'Unknown Realm'}>
          <Cell
            isDisabled={true}
            cellStyle="Basic"
            titleTextStyle={ { textAlign: 'center' } }
            titleTextStyleDisabled={ { textAlign: 'center' } }
            title="Loading..."
          />
        </Section>
      );
    } else if (this.props.data.error) {
      console.log('Error fetching character list from ', this.props.realm.url, ': ', this.props.data.error.message);
      return (
        <Section
          header={this.props.realm.name ? this.props.realm.name : 'Unknown Realm'}>
          <Cell
            isDisabled={true}
            cellStyle="Basic"
            titleTextStyle={ { textAlign: 'center' } }
            titleTextStyleDisabled={ { textAlign: 'center' } }
            title="Error Loading :("
          />
        </Section>
      );
    } else {
      return (
        <Section
          header={this.props.realm.name ? this.props.realm.name : 'Unknown Realm'}>
          { this._characterCells() }
        </Section>
      );
    }
  }
}
CharacterList.propTypes = {
  realm: PropTypes.object.isRequired
};

const UserQuery = gql`
  query UserQuery($id: String!) {
    user(id: $id) {
      characters {
        id,
        name,
        displayName
      }
    }
  }
`;

const WrappedCharacterList = graphql(UserQuery, {
  options: ({ realm }) => ({
    variables: {
      id: realm.session.user.id
    },
    pollInterval: RefreshInterval
  })
})(connect()(CharacterList));

class CharacterListShim extends Component {
  render() {
    return (
      <ApolloProvider client={this.props.realm.apollo}>
        <WrappedCharacterList {...this.props}/>
      </ApolloProvider>
    );
  }
}

export default CharacterListShim;
