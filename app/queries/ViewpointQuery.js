'use strict';

import { gql } from 'react-apollo';

module.exports = gql`
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
