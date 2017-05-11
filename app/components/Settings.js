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
  TouchableHighlight,
  Alert,
} from 'react-native';
import {
  Cell,
  Section,
  TableView,
} from 'react-native-tableview-simple';
import { connect } from 'react-redux';
import _ from 'lodash';
import util from 'util';

import ActionTypes from '../constants/ActionTypes';
import RootView  from './RootView';
import { purgeStorage } from '../setup';

class Settings extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Settings',
  });

  _onResetContent = () => {
    Alert.alert(
      'Logout and Reset Local Content',
      'Are you sure you want to log out of all realms on this device and remove any stored data?',
      [
        { text: 'Cancel', onPress: () => {} },
        { text: 'Yes', onPress: () => {
            this.props.dispatch({
              type: ActionTypes.PURGE
            });
          }
        },
      ]);
  }

  render() {
    return (
      <RootView>
        <TableView>
          <Section>
            <Cell
            onPress={() => {
              this._onResetContent();
            }}
            cellStyle="Basic"
            titleTextColor="red"
            titleTextStyle={ { textAlign: 'center' } }
            title="Logout and Reset Local Content"
          />
          </Section>
        </TableView>
      </RootView>
    );
  }
}
Settings.propTypes = {
  realms: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  realms: state.realms
});

export default connect(
  mapStateToProps
)(Settings);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#F6F6F6',
  },
  text: {
    flex: 1,
  }
});
