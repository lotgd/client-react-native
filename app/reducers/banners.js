// @flow
'use strict';

import ActionTypes from '../constants/ActionTypes';

var initialState = {
  counter: 0
};

function createBanner(banners, text, bannerType) {
  var id = banners.counter + 1;
  var newBanners = { ...banners };
  newBanners[id] = {
    text: text,
    type: bannerType,
    timestamp: (new Date()).getTime(),
  };
  newBanners.counter = id;

  return newBanners;
}

export default function banners(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.BANNER_ADD:
      var text = action.banner.text.trim();
      if (text !== '') {
        return {
          ...createBanner(state, action.banner.text, action.banner.type)
        };
      } else {
        return state;
      }
    case ActionTypes.BANNER_DELETE:
      var newState = { ...state };
      delete newState[action.id];
      return newState;
    default:
      return state;
  };
};
