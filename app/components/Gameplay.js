'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { gql, graphql } from 'react-apollo';
import _ from 'lodash';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { ApolloProvider } from 'react-apollo';
import {
  Cell,
  Section,
  TableView,
} from 'react-native-tableview-simple';

import ActionTypes from '../constants/ActionTypes';
import HeadsUpDisplay from './HeadsUpDisplay';
import HotKeyboard from './HotKeyboard';
import RootView from './RootView';

class Gameplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      loading: false,
    };
  }

  _onAction = (id) => {
    console.log(id);
  }

  render() {
    const error = this.state.error ? (
      <Text style={styles.error}>
        { this.state.error }
      </Text>
    ) : null;

    const lines = (
      <Text style={styles.description}>
        { this.props.data.viewpoint.description }
      </Text>
    );

    const hudValues = {
      'HP': '0/0',
      'EXP': 1000,
    };

    const sortedActionGroups = _.sortBy(this.props.data.viewpoint.actionGroups, [function(o) { return o.sortKey }]);

    const onAction = this._onAction;
    const sections = _.map(sortedActionGroups, function(g) {
      return (
        <Section
          key={g.id}
          header={g.title}
        >
          {
            _.map(g.actions, function(a) {
              return  (
                <Cell
                  key={a.id}
                  onPress={() => {
                    onAction(a.id);
                  }}
                  cellStyle="Basic"
                  titleTextColor="#5291F4"
                  titleTextStyle={ { textAlign: 'center' } }
                  title={a.title}
                />
              );
            })
          }
        </Section>
      );
    });

    const keys = _.flatMap(sortedActionGroups, function(g) {
      return _.map(g.actions, function(a) {
        return {
          key: a.title.slice(0,1),
          value: a.id
        };
      });
    });

    return (
      <ApolloProvider client={this.props.realm.apollo}>
        <RootView>
          <ScrollView>
            { error }
            <TableView>
              { lines }
              { sections }
            </TableView>
          </ScrollView>
          <HeadsUpDisplay values={hudValues}/>
          <HotKeyboard
            keys={keys}
            onPress={(k) => { this._onAction(k.value); }}
          />
        </RootView>
      </ApolloProvider>
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

const WrappedGameplay = connect()(graphql(takeActionMutation)(Gameplay));

class GameplayNavigatorShim extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Gameplay', // TODO: figure out how to set the right title.
  });

  render() {
    return (
      <ApolloProvider client={this.props.navigation.state.params.realm.apollo}>
        <WrappedGameplay
          {...this.props}
          realm={this.props.navigation.state.params.realm}
          navigation={this.props.navigation}
          data={
            {
              viewpoint: {
                title: 'Village Square',
                description: "The village square hustles and bustles. No one really notices that you're are standing there. You see various shops and businesses along main street. There is a curious looking rock to one side. On every side the village is surrounded by deep dark forest.",
                template: 'lotgd/module-village/village',
                actionGroups: [
                  {
                    id: '1',
                    title: null,
                    sortKey: '1',
                    actions: [
                      {
                        id: '1',
                        title: 'Forest',
                      },
                      {
                        id: '2',
                        title: 'Weapon Shop',
                      },
                      {
                        id: '3',
                        title: 'Armor Shop',
                      }
                    ]
                  }
                ]
              }
            }
          }
        />
      </ApolloProvider>
    );
  }
}

module.exports = GameplayNavigatorShim;

const styles = StyleSheet.create({
  description: {
    color: '#787878',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 20,
    paddingBottom: 10,
    fontSize: 20,
  },
  error: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    textAlign: 'center',
    color: 'red',
  },
});
