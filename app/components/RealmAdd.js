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
        this.props.navigator.replace({
          uri: 'lotgd://app/home'
        });
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

    const connectButtonText = 'Connect' + (this.state.loading ? ' (...)' : '');
    return (
      <RootView>
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
          <Text>
            Connect to a Legend of the Green Dragon compatible server.
          </Text>
          <TextInput
            style={styles.inputBox}
            keyboardType={'url'}
            autoCorrect={false}
            autoCapitalize={'none'}
            onChangeText={(url) => this.setState({ url: _.trim(url) })}
            placeholder='http://your.lotgdserver.com'
          />

          <TouchableHighlight
            onPress={this.onConnect}
            disabled={this.state.loading}
            style={styles.loginContainer}>
            <View style={styles.loginContent}>
              <Text style={styles.loginContainerText}>
                { connectButtonText }
              </Text>
            </View>
          </TouchableHighlight>
          { connectError }
        </KeyboardAvoidingView>
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
  connectError: {
    color: 'red',
  }
});
