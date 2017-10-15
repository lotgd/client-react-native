'use strict';
import React, { Component } from 'react'; import {
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

function hotKeyifyTitle(title, hotKey) {
  let lowerTitle = _.lowerCase(title);
  let lowerHotKey = _.lowerCase(hotKey);
  let index = lowerTitle.indexOf(lowerHotKey);

  if (index > -1) {
    let prefix = title.substring(0, index);
    let key = title.substring(index, index + hotKey.length);
    let suffix = title.substring(index + hotKey.length);
    return (
      <Text>{prefix}<Text style={{fontWeight: 'bold'}}>{key}</Text>{suffix}</Text>
    );
  } else {
    return (
      <Text>{title}</Text>
    );
  }
}

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
    var view = null;

    if (this.props.data.loading) {
      view = <Text>Loading...</Text>;
    } else if (this.props.data.error) {
      view = <Text style={styles.error}>{ this.props.data.error.message }</Text>;
    } else {
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
                      title={hotKeyifyTitle(a.title, a.title.slice(0, 1))}
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
              <TableView>
                { lines }
                { sections }
              </TableView>
            </ScrollView>
            <HeadsUpDisplay values={hudValues}/>
            <HotKeyboard
              keys={keys}
              realm={this.props.realm}
            />
          </View>
        );
      }

      return (
        <ApolloProvider client={this.props.realm.apollo}>
          <RootView>
            { view }
          </RootView>
        </ApolloProvider>
      );
    }
  }

const ViewpointQuery = gql`
query ViewpointQuery($id: String!) {
  viewpoint(characterId: $id) {
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
`;

const WrappedGameplay = graphql(ViewpointQuery, {
  options: ({ navigation }) => ({
    variables: {
      id: navigation.state.params.characterId
    }
  })
})(connect()(Gameplay));

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
