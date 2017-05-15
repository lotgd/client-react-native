// @flow
'use strict';
import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableHighlight,
  KeyboardAvoidingView,
} from 'react-native';
import { connect } from 'react-redux';
import {
  Cell,
  Section,
  TableView,
} from 'react-native-tableview-simple';

import ActionTypes from '../constants/ActionTypes';
import RootView from './RootView';
import { RealmLoader, RealmBindApollo, RealmNotCompatibleError, RealmNotFoundError } from '../helpers/Realm';
import _ from 'lodash';

class RealmAdd extends Component {
  state: {
    loading: boolean,
    connectError: ?string,
    url: string,
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Add Realm',
  });

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      connectError: null,
      url: '',
    };
  }

  onConnect = () => {
    this.setState({
      loading: true,
      connectError: null,
    });

    if (this.state.url.length == 0) {
      this.setState({
        loading: false,
        connectError: "You must enter a URL.",
      });
      return;
    }

    // Check if realm is already a part of the list.
    if (this.props.realms[this.state.url]) {
      this.setState({
        loading: false,
        connectError: "You're already connected to that realm.",
      });
      return;
    }

    var url = this.state.url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'http://' + url;
    }

    // TODO: need to handle the case when we should be connecting over https
    // instead of guessing http

    // Sanity check first: verify there's really a Daenerys server at
    // the other end of this URL.
    RealmLoader(url).then((realm) => {
      if (realm) {
        console.log("Adding realm: " + JSON.stringify(realm));

        // Create the Apollo client and bind it to the realm.
        const boundRealm = RealmBindApollo(url, realm);

        // Save the realm in our state.
        this.props.dispatch({
          type: ActionTypes.REALM_ADD,
          url: url,
          realm: boundRealm,
        });

        // For now, just navigate to the home screen.
        this.props.navigation.navigate('Home');
      } else {
        this.setState({
          connectError: "Can't seem to find a compatible server at that address.",
        });
      }
      this.setState({
        loading: false,
      });
    }).catch((error) => {
      console.log('Error checking compatibility of ' + (url ? url : 'null') + ': ' + error);

      if (error instanceof RealmNotCompatibleError) {
        this.setState({
          loading: false,
          connectError: "Couldn't find a compatible server at that address. This app only support Daenerys compatible servers.",
        });
      } else if (error instanceof RealmNotFoundError) {
        this.setState({
          loading: false,
          connectError: "Can't connect to that server. Check your connection and the URL and try again.",
        });
      } else {
        this.setState({
          loading: false,
          connectError: "Something went wrong while connecting. Try again.",
        });
      }
    });
  }

  render() {
    var connectError = this.state.connectError ? (
      <Text style={styles.connectError}>
        { this.state.connectError }
      </Text>
    ) : null;

    return (
        <RootView>
          <TableView>
            <Section
              headerComponent={
                <Text style={styles.header}>
                  Connect to a Legend of the Green Dragon compatible server.
                </Text>
              }
              footerComponent={connectError}
            >
                <Cell
                  contentContainerStyle={{ alignItems: 'flex-start', height: 44 }}
                  cellContentView={
                    <TextInput
                      style={styles.inputBox}
                      keyboardType={'url'}
                      autoCorrect={false}
                      autoCapitalize={'none'}
                      onChangeText={(url) => this.setState({ url: _.trim(url) })}
                      placeholder='http://your.lotgdserver.com'
                    />
                  }
                />
              </Section>
              <Section>
                <Cell
                  onPress={this.onConnect}
                  isDisabled={this.state.loading}
                  cellStyle="Basic"
                  titleTextColor="#5291F4"
                  titleTextStyle={ { textAlign: 'center' } }
                  titleTextStyleDisabled={ { textAlign: 'center' } }
                  title="Connect"
                />
            </Section>
          </TableView>
        </RootView>
    );
  }
}
RealmAdd.propTypes = {
  realms: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  realms: state.realms
});

export default connect(mapStateToProps)(RealmAdd);

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
  }
});
