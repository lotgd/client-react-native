'use strict';

import { gql } from 'react-apollo';

module.exports = gql`
query ViewpointQuery($characterId: String!) {
  viewpoint(characterId: $characterId) {
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
