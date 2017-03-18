// @flow
'use strict';

import React, { Component } from 'react';

import RootView from './RootView';

class Bootstrap extends Component {
  componentDidMount() {
    global.storage.load({
      key: 'token'
    }).then(ret => {
      this.props.navigator.resetTo({ uri: 'lotgd://app/home' });
    }).catch(err => {
      switch (err.name) {
        case 'NotFoundError':
          this.props.navigator.resetTo({ uri: 'lotgd://app/login' });
          break;
        default:
          console.warn(err.message);
          break;
      }
    });
  }

  render() {
    return <RootView/>;
  }
}

module.exports = Bootstrap;
