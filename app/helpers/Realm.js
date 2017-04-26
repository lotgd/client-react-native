// @flow
'use strict';

import _ from 'lodash';
import { ApolloClient, ApolloProvider, createNetworkInterface } from 'react-apollo';

export class RealmNotFoundError extends Error {}
export class RealmNotCompatibleError extends Error {}

function verifyStatus(response): Promise<Object> {
  if (response.status != 200) {
    throw new RealmNotCompatibleError('Realm not compatible: no GraphQL endpoint');
  } else {
    return response.json().catch((e) => {
      throw new RealmNotCompatibleError('Realm not compatible: cannot parse response');
    });
  }
}

function verifyGraphQLResponse(response): Promise<Object> {
  if (_.has(response, 'data.realm.configuration.crate.version')) {
    return Promise.resolve({ realm: response.data.realm });
  } else {
    throw new RealmNotCompatibleError('Realm not compatible: GraphQL response lacks a crate version');
  }
}

// Create an Apollo client and return a copy of the provided realm object
// with the client mapped to 'apollo'.
export function RealmBindApollo(url: string, realm: Object): Object {
  const networkInterface = createNetworkInterface({
    uri: url, // Note, don't use realm.url b/c that's returned by the server, who knows what that is.
  });

  networkInterface.use([{
    applyMiddleware(req, next) {
      if (!req.options.headers) {
          req.options.headers = {};  // Create the header object if needed.
      }
      req.options.headers.token = realm.session.apiKey ? realm.session.apiKey : null;
      next();
    }
  }]);

  const client = new ApolloClient({
    networkInterface,
  });

  return {
    ...realm,
    apollo: client,
  };
}

// Resolves to a realm model if the url represents a "valid" daenerys graphql server. Does
// only the most cursory check: that the realm responds to a realm query.
// Resolves or rejects to an object like this:
// {
//    error: <string>
//    realm: Realm object on success
// }
export function RealmLoader(url: string): Promise<?Object> {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: "{ realm { url, name, description, configuration { core { name, version }, crate { name, version } } } }"
    })
  }).catch((e) => {
    throw new RealmNotFoundError(e.message)
  }).then(verifyStatus)
    .then(verifyGraphQLResponse);
}
