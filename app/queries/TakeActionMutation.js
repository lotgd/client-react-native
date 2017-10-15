'use strict';

import { gql } from 'react-apollo';

module.exports = gql`
mutation TakeActionMutation($input: TakeActionInput!) {
  takeAction(input: $input) {
    viewpoint {
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
}
`;
