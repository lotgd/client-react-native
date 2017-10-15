'use strict';
import React, { Component } from 'react';
import QuickKeyboard from './QuickKeyboard';
import { gql, graphql } from 'react-apollo';
import { connect } from 'react-redux';

import ViewpointQuery from '../queries/ViewpointQuery';
import TakeActionMutation from '../queries/TakeActionMutation';

class HotKeyboard extends Component {
  _onAction(value) {
    this.props.mutate({
      variables: {
        input: {
          'clientMutationId': 'mutationId',
          'characterId': this.props.characterId,
          'actionId': value
        }
      },
      refetchQueries: [{
        query: ViewpointQuery,
        variables: { characterId: this.props.characterId },
      }]
    });
  }

  render() {
    return (
      <QuickKeyboard
        keys={this.props.keys}
        onPress={(k) => { this._onAction(k.value); }}
      />
    );
  }
}

const WrappedKeyboard = connect()(graphql(TakeActionMutation)(HotKeyboard));

module.exports = WrappedKeyboard;
