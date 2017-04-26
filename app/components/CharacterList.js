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
import _ from 'lodash';

const CreateNewCharacterModel = { displayName: 'Create new character...', id: '-1' };

class CharacterList extends Component {
  state: {
    characters: Array<Object>;
  }

  constructor(props: Object) {
    super(props);

    this.state = {
      characters: [ ...props.characters, CreateNewCharacterModel ]
    };
  }

  componentWillReceiveProps(nextProps: Object) {
    this.setState({
      characters: [...nextProps.characters, CreateNewCharacterModel]
    });
  }

  _onPress = (model: Object) => {
    // TODO: move this to a callback
    if (model.id == CreateNewCharacterModel.id) {
      this.props.navigator.push({ uri: 'lotgd://app/realm/new-character', session: this.props.session });
    } else {
      // TODO: navigate to the game
    }
  }

  render() {
    const rows = _.map(this.state.characters, (character) => {
      return (
        <Cell onPress={() => {
            this._onPress(character);
          }}
          cellStyle="Basic"
          title={character.displayName}
        />
      );
    });
    return (
      <View>
        { rows }
      </View>
    );
  }
}
CharacterList.propTypes = {
  characters: PropTypes.array.isRequired,
};

export default CharacterList;
