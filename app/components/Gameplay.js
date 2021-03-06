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
import { ApolloProvider, compose, gql, graphql } from 'react-apollo';
import _ from 'lodash';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import {
  Cell,
  Section,
  TableView,
} from 'react-native-tableview-simple';

import ActionTypes from '../constants/ActionTypes';
import HeadsUpDisplay from './HeadsUpDisplay';
import QuickKeyboard from './QuickKeyboard';
import FullScreenLoading from './FullScreenLoading';
import RootView from './RootView';
import GameplayHeader from './GameplayHeader';
import ViewpointQuery from '../queries/ViewpointQuery';
import TakeActionMutation from '../queries/TakeActionMutation';

function hotKeyifyTitle(title, hotKey) {
  let lowerTitle = _.lowerCase(title);
  let lowerHotKey = _.lowerCase(hotKey);
  let index = lowerTitle.indexOf(lowerHotKey);

  if (index > -1) {
    let prefix = title.substring(0, index);
    let key = title.substring(index, index + hotKey.length);
    let suffix = title.substring(index + hotKey.length);
    return (
      <Text>{ prefix }<Text style={{ fontWeight: '600' }}>{ key }</Text>{ suffix }</Text>
    );
  } else {
    return (
      <Text>{ title }</Text>
    );
  }
}

class Gameplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      loading: true,
    };
  }

  _onAction = (id) => {
    this.setState({ loading: true });

    this.props.mutate({
      variables: {
        input: {
          'clientMutationId': 'mutationId',
          'characterId': this.props.characterId,
          'actionId': id,
        }
      },
    }).catch((e) => {
      this.setState({
        error: e,
        loading: false
      });
    }).then(() => {
      this.props.data.refetch();
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.loading != this.state.loading) {
      this.setState({ loading: nextProps.data.loading });
    }
  }

  render() {
    var view = null;

    if (this.state.loading) {
      view = <FullScreenLoading/>
    } else if (this.state.error) {
      view = <Text style={ styles.error }>{ this.state.error.message }</Text>;
    } else {
      const viewpoint = this.props.data.viewpoint;

      const lines = (
        <Text style={ styles.description }>
          { viewpoint.description }
        </Text>
      );

      const hudValues = {
        'HP': '0/0',
        'EXP': 1000,
      };

      const sortedActionGroups = _(viewpoint.actionGroups)
        .filter(
          function (o) {
            return o.actions.length > 0 && o.id != 'lotgd/core/default';
          }
        ).sortBy(
          [function(o) {
            return o.sortKey
          }]
        ).value();

      const onAction = this._onAction;
      const sections = _.map(sortedActionGroups, function(g) {
        return (
          <Section
            key={ g.id }
            headerComponent={ <Text style={ styles.header }>{ g.title }</Text> }
            topSeparator={ false }
            bottomSeparator={ false }
            >
              {
                _.map(g.actions, function(a) {
                  return  (
                    <Cell
                      key={ a.id }
                      onPress={() => { onAction(a.id); }}
                      cellStyle='Basic'
                      titleTextColor='#5291F4'
                      titleTextStyle={{ textAlign: 'center' }}
                      title={ hotKeyifyTitle(a.title, a.title.slice(0, 1)) }
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
              key: a.title.slice(0, 1),
              value: a.id
            };
          });
        });

        view = (
          <View style={styles.container}>
            <ScrollView>
              <GameplayHeader
                back='Home'
                title={ viewpoint.title }
                onBack={() => { this.props.navigation.dispatch(NavigationActions.back()); }}
              />
              <TableView>
                { lines }
                { sections }
              </TableView>
            </ScrollView>
            <HeadsUpDisplay values={hudValues}/>
            <QuickKeyboard
              keys={keys}
              onPress={(k) => { this._onAction(k.value); }}
            />
          </View>
        );
      }

      return (
        <RootView>
          { view }
        </RootView>
      );
    }
  }

const WrappedGameplay = compose(
  graphql(ViewpointQuery, {
    options: ({ navigation }) => ({
      variables: {
        characterId: navigation.state.params.characterId
      }
    }),
  }),
  graphql(TakeActionMutation)
)(connect()(Gameplay));

class GameplayNavigatorShim extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Gameplay', // TODO: figure out how to set the right title.
    header: null,
  });

  render() {
    return (
      <ApolloProvider client={this.props.navigation.state.params.realm.apollo}>
        <WrappedGameplay
          {...this.props}
          realm={this.props.navigation.state.params.realm}
          characterId={this.props.navigation.state.params.characterId}
          navigation={this.props.navigation}
        />
      </ApolloProvider>
    );
  }
}

module.exports = GameplayNavigatorShim;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 16,
    paddingBottom: 5,
    fontWeight: '300',
    color: '#787878',
    textAlign: 'center',
  },
  description: {
    color: '#787878',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 0,
    paddingBottom: 10,
    fontSize: 20,
    fontWeight: '300',
    lineHeight: 28,
  },
  error: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    textAlign: 'center',
    color: 'red',
  },
});
