'use strict';
import React, { Component } from 'react';
import QuickKeyboard from './QuickKeyboard';
import { gql, graphql } from 'react-apollo';
import { connect } from 'react-redux';

class HotKeyboard extends Component {
  _onAction(value) {
    this.props.mutate({
      variables: {
        input: {
          'clientMutationId': 'mutationId',
          'characterId': this.props.realm.session.userId,
          'actionId': value
        }
      }
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

const takeActionMutation = gql`
  mutation takeActionMutation($input: TakeActionInput!) {
    takeAction(input: $input) {
      viewpoint {
        title,
        description,
        template,
        actionGroups {
          id,
          title,
          sortKey,
          actions {
            id,
            title,
          }
        }
      }
    }
  }
`;

const WrappedKeyboard = connect()(graphql(takeActionMutation)(HotKeyboard));

module.exports = WrappedKeyboard;
