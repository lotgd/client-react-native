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
} from 'react-native';
import {
  Cell,
  Section,
  TableView,
} from 'react-native-tableview-simple';
import { connect } from 'react-redux';
import _ from 'lodash';
import util from 'util';
import Icon from 'react-native-vector-icons/Ionicons';

import RootView  from './RootView';

const CreateNewCharacterModel = { displayName: 'Create new character', id: '-1' };
const LoginModel = { displayName: 'Login or sign up', id: '-2' };

class Home extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Realms',
    headerLeft: <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Settings')
                  }}>
                    <Icon name="ios-settings" size={30} style={{ marginLeft: 10 }} color="#4F8EF7" />
                </TouchableOpacity>
  });

  _onAddRealm = () => {
    this.props.navigation.navigate('RealmAdd');
  }

  _onPress = (model: Object, realm: Object) => {
    // TODO: move this to a callback
    if (model.id == CreateNewCharacterModel.id) {
      this.props.navigation.navigate('CreateCharacter', { realm: realm });
    } else if (model.id == LoginModel.id) {
      this.props.navigation.navigate('CreateUser', { realm: realm });
    } else {
      // TODO: navigate to the game
    }
  }

  render() {
    const _characterCellsForRealm = (realm) => {
      if (realm._session) {
        const characterModels = [
          ..._.map(realm.characters ? realm.characters : {}, (c) => {
            return c;
          }),
          CreateNewCharacterModel,
        ];
        return _.map(characterModels, (character) => {
          return (
            <Cell
              key={character.displayName}
              onPress={() => {
                this._onPress(character, realm);
              }}
              cellStyle="Basic"
              accessory="DisclosureIndicator"
              title={character.displayName}
            />
          );
        });
      } else {
        return (
          <Cell
            key={LoginModel.displayName}
            onPress={() => {
              this._onPress(LoginModel, realm);
            }}
            accessory="DisclosureIndicator"
            cellStyle="Basic"
            title={LoginModel.displayName}
          />
        );
      }
    };

    const realms = _.map(this.props.realms, (realm, url) => {
      return (
        <Section
          key={url}
          header={realm.name ? realm.name : 'Unknown Realm'}>
          { _characterCellsForRealm(realm) }
        </Section>
      );
    });

    // TableView only takes an array or a single element without a warning, lolz.
    realms.push(
      <Section key="AddRealm">
        <Cell
          onPress={() => {
            this._onAddRealm();
          }}
          cellStyle="Basic"
          titleTextColor="#5291F4"
          titleTextStyle={ { textAlign: 'center' } }
          title="Add Realm"
        />
      </Section>
    );

    return (
      <RootView>
        <TableView>
          { realms }
        </TableView>
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
  text: {
    flex: 1,
  }
});
