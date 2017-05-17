import realms from '../realms'
import ActionTypes from '../../constants/ActionTypes'

describe('realms reducer', () => {
  it('should handle initial state', () => {
    expect(
      realms(undefined, {})
    ).to.eql({});
  });

  it('should handle REALM_LOGIN with no realm', () => {
    expect(
      realms({}, {
        type: ActionTypes.REALM_LOGIN,
        url: 'test',
        session: {
          foo: 'bar'
        }
      })
    ).to.eql({});
  });

  it('should handle REALM_LOGIN', () => {
    expect(
      realms({
        'testUrl': {
          foo: 'bar',
        },
      }, {
        type: ActionTypes.REALM_LOGIN,
        url: 'testUrl',
        session: {
          foo: 'baz',
        },
      })
    ).to.eql({
      'testUrl': {
        foo: 'bar',
        session: {
          foo: 'baz',
        },
      }
    });
  });

  it('should handle REALM_ADD', () => {
    expect(
      realms({}, {
        type: ActionTypes.REALM_ADD,
        url: 'this is url',
        realm: {
          url: 'this is url2'
        }
      })
    ).to.eql({
      'this is url': {
        url: 'this is url'
      }
    });

    expect(
      realms({
        'this is url': {
          url: 'this is url2'
        }
      }, {
        type: ActionTypes.REALM_ADD,
        url: 'Run more tests',
        realm: {
          url: 'Run more tests',
        }
      })
    ).to.eql({
      'this is url': {
        url: 'this is url2'
      },
      'Run more tests': {
        url: 'Run more tests'
      }
    });
  });

  it('should handle REALM_DELETE', () => {
    expect(
      realms({
        'this is url': {
          url: 'this is url'
        },
      }, {
        type: ActionTypes.REALM_DELETE,
        url: 'this is url'
      })
    ).to.eql({});

    expect(
      realms({
        'this is url': {
          url: 'this is url'
        },
      }, {
        type: ActionTypes.REALM_DELETE,
        url: 'not found'
      })
    ).to.eql({
      'this is url': {
        url: 'this is url'
      },
    });
  });

  it('should handle REALM_CHARACTER_ADD', () => {
    expect(
      realms({
        'this is url': {
          url: 'this is url'
        },
      }, {
        type: ActionTypes.REALM_CHARACTER_ADD,
        url: 'this is url',
        character: {
          id: 'id1'
        }
      })
    ).to.eql({
      'this is url': {
        url: 'this is url',
        characters: {
          'id1': {
            id: 'id1'
          }
        }
      },
    });
  });

  it('should handle REALM_CHARACTER_ADD with multiple characters', () => {
    expect(
      realms({
        'this is url': {
          url: 'this is url',
          characters: {
            'id2': {
              id: 'id2'
            }
          }
        },
      }, {
        type: ActionTypes.REALM_CHARACTER_ADD,
        url: 'this is url',
        character: {
          id: 'id1'
        }
      })
    ).to.eql({
      'this is url': {
        url: 'this is url',
        characters: {
          'id1': {
            id: 'id1'
          },
          'id2': {
            id: 'id2'
          }
        }
      },
    });
  });

  it('should handle REALM_CHARACTER_ADD with no realm', () => {
    expect(
      realms({
        'another one': {
          url: 'another one',
        }
      }, {
        type: ActionTypes.REALM_CHARACTER_ADD,
        url: 'this is url',
        character: {
          id: 'id1'
        }
      })
    ).to.eql({
      'another one': {
        url: 'another one',
      }
    });
  });
});
