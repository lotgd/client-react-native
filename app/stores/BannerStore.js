'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('EventEmitter');
var LotGDConstants = require('../constants/LotGDConstants');

const CHANGE_EVENT = 'change';

var _banners = {};

/**
 * Create a banner item.
 * @param   {string} text The content of the banner
 * @param   {string} text The type of the banner: 'info' or 'error'
 */
function create(text, type) {
  // Using the current timestamp + random number in place of a real id.
  var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  _banners[id] = {
    id: id,
    text: text,
    type: type,
    timestamp: (new Date()).getTime(),
  };
}

/**
 * Delete a banner item.
 * @param  {string} id
 */
function destroy(id) {
  delete _banners[id];
}

var BannerStore = new EventEmitter();

/**
* Get all the Banners.
* @return {object}
*/
BannerStore.getAll = function() {
  return _banners;
};

BannerStore.emitChange = function() {
  this.emit(CHANGE_EVENT);
};

/**
* @param {function} callback
*/
BannerStore.addChangeListener = function(callback) {
  this.addListener(CHANGE_EVENT, callback);
};

/**
* @param {function} callback
*/
BannerStore.removeChangeListener = function(callback) {
  this.removeListener(CHANGE_EVENT, callback);
};

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  var text;

  switch(action.actionType) {
    case LotGDConstants.BANNER_ADD:
      text = action.text.trim();
      if (text !== '') {
        create(text, action.type);
        BannerStore.emitChange();
      }
      break;

    case LotGDConstants.BANNER_REMOVE:
      destroy(action.id);
      BannerStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = BannerStore;
