// @flow
'use strict';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
import { connect } from 'react-redux';
import _ from 'lodash';
import util from 'util';
import Icon from 'react-native-vector-icons/Feather';

import RootView  from './RootView';
import CharacterList from './CharacterList';

const LoginModel = { displayName: 'Sign up or login', id: '-2' };

class Home extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Legend of the Green Dragon',
    headerLeft: <TouchableOpacity
                  onPress={() => { navigation.navigate('Settings') }}>
                    <Icon name="settings" size={22} style={{ marginLeft: 10 }} color="#4F8EF7" />
                </TouchableOpacity>,
    headerTitleStyle: { fontSize: 15 }
  });

  _onAddRealm = () => {
    this.props.navigation.navigate('RealmAdd');
  }

  _onPress = (model: Object, realm: Object) => {
    if (model.id == LoginModel.id) {
      this.props.navigation.navigate('UserCreate', { realm: realm });
    }
  }

  render() {
    const realms = _.map(this.props.realms, (realm, url) => {
      if (realm.session) {
        return <CharacterList
          key={url}
          realm={realm}
          navigation={this.props.navigation}/>
      } else {
        return (
          <Section
            key={url}
            header={realm.name ? realm.name : 'Unknown Realm'}>
            <Cell
              key={LoginModel.displayName}
              onPress={() => {
                this._onPress(LoginModel, realm);
              }}
              accessory="DisclosureIndicator"
              cellStyle="Basic"
              title={LoginModel.displayName}
            />
          </Section>
        );
      }
    });
    if (realms.length == 0) {
      realms.push(
        <Text
          style={styles.infoText}
          key="no-realms"
        >
          You're not connected to any realms yet. Add a realm using the button below.
        </Text>
      );
    }

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
        <ScrollView>
          <TableView>
            { realms }
          </TableView>
        </ScrollView>
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
  infoText: {
    color: '#787878',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 25,
    textAlign: 'center',
  }
});
