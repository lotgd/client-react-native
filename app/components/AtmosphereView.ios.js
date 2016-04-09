var React = require('react-native');
var { requireNativeComponent } = React;

class AtmosphereView extends React.Component {
  render() {
    return <LotGDAtmosphere {...this.props} />;
  }
}

AtmosphereView.propTypes = {
};

var LotGDAtmosphere = requireNativeComponent('LotGDAtmosphere', AtmosphereView);

module.exports = AtmosphereView;
