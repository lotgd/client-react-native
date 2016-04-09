var AppDispatcher = require('../dispatcher/AppDispatcher');
var LotGDConstants = require('../constants/LotGDConstants');

var LotGDActions = {
  addBanner: function(text, type) {
    AppDispatcher.dispatch({
      actionType: LotGDConstants.BANNER_ADD,
      text: text,
      type: type
    });
  },

  removeBanner: function(id) {
    AppDispatcher.dispatch({
      actionType: LotGDConstants.BANNER_REMOVE,
      id: id,
    });
  },
};

module.exports = LotGDActions;
