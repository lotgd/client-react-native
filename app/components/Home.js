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
  TouchableHighlight
} from 'react-native';
import {
  Cell,
  Section,
  TableView,
} from 'react-native-tableview-simple';
import { connect } from 'react-redux';
import _ from 'lodash';

import RootView  from './RootView';

const CreateNewCharacterModel = { displayName: 'Create new character...', id: '-1' };

class Home extends Component {
  _onAddRealm = () => {
    this.props.navigator.push({
      uri: 'lotgd://app/realm/add'
    });
  }

  _onPress = (model: Object) => {
    // TODO: move this to a callback
    if (model.id == CreateNewCharacterModel.id) {
      this.props.navigator.push({ uri: 'lotgd://app/realm/create-character', session: this.props.session });
    } else {
      // TODO: navigate to the game
    }
  }

  render() {
    const _cellsForCharacters = (characters: Array<Object>) => {
      return _.map([ ...characters, CreateNewCharacterModel ], (character) => {
        return (
          <Cell
            key={character.displayName}
            onPress={() => {
              this._onPress(character);
            }}
            cellStyle="Basic"
            title={character.displayName}
          />
        );
      });
    };

    const realms = _.map(this.props.realms, (realm, url) => {
      return (
        <Section
          key={url}
          header={realm.name ? realm.name : 'Unknown Realm'}>
          { _cellsForCharacters(realm.characters ? realm.characters : []) }
        </Section>
      );
    });
    return (
      <RootView>
        <TableView>
          { realms }
        </TableView>
        <TouchableHighlight onPress={this._onAddRealm}>
          <Text>
            Add Realm
          </Text>
        </TouchableHighlight>
      </RootView>
    );
  }
}
Home.propTypes = {
  realms: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  realms: state.realms
});

export default connect(
  mapStateToProps
)(Home);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#F6F6F6',
  },
  thumb: {
    width: 64,
    height: 64,
  },
  text: {
    flex: 1,
  }
});
