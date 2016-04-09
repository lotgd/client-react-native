var AtmosphereView = require('./AtmosphereView');

var Weather = React.createClass({
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows([
        'You are in a village whose very buildings emanate with the feel of magic. Around you are the scared looking faces of other young adventurers.',
        'You have no idea exactly how it is that you got to this place, but you feel that it is very safe to remain here for some time.'
      ]),
    };
  },

  render: function() {
    return (
      <View style={styles.container}>
        <AtmosphereView
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: require('Dimensions').get('window').width,
            height: require('Dimensions').get('window').height,
          }}
        />
        <ListView
          style={{marginTop: 20, backgroundColor: 'rgba(0,0,0,0)'}}
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <Text style={styles.textRow}>{rowData}</Text>}>
        </ListView>
      </View>
    );
  }
});
