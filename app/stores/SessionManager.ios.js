'use strict';

var FBSDKCore = require('react-native-fbsdkcore');
var {
  FBSDKAccessToken,
} = FBSDKCore;

var FBSDKLogin = require('react-native-fbsdklogin');
var {
  FBSDKLoginManager,
} = FBSDKLogin;

class SessionManager {
  loginToFacebook() {
    return new Promise(function(resolve, reject) {
      FBSDKLoginManager.logInWithReadPermissions([], (error, result) => {
        if (error) {
          reject(new Error('Error logging in.'));
        } else {
          if (result.isCancelled) {
            reject(new Error('Login cancelled.'));
          } else {
            onSuccess();
          }
        }
      });
    });
  }

  loginToNexus() {
    return new Promise(function(resolve, reject) {
      resolve();
    });
  }

  isLoggedIn() {
    return false;
  }

  getFacebookUserID() {
    return new Promise(function(resolve, reject) {
      FBSDKAccessToken.getCurrentAccessToken(function (t) {
        if (t && t.userID) {
          resolve(t.userID);
        } else {
          reject(new Error('null token'));
        }
      });
    });
  }

  getNexusUserID() {
    return 'id';
  }

  getFacebookAccessToken() {
    return new Promise(function(resolve, reject) {
      FBSDKAccessToken.getCurrentAccessToken(function (t) {
        if (t && t.tokenString) {
          resolve(t.tokenString);
        } else {
          reject(new Error('null token'));
        }
      });
    });
  }

  getNexusAccessToken() {
    return 'token';
  }

  logout() {
    // TODO: remove Nexus access token.
    FBSDKLoginManager.logOut();
  }
}

module.exports = SessionManager;
