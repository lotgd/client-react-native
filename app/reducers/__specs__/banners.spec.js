import banners from '../banners'
import ActionType from '../../constants/ActionTypes'

describe('banners reducer', () => {
  it('should handle initial state', () => {
    expect(
      banners(undefined, {})
    ).to.eql({
      counter: 0
    });
  });

  it('should handle BANNER_ADD', () => {
    var r = banners({ counter: 1 }, {
            type: ActionType.BANNER_ADD,
            banner: {
              text: 'Run the tests',
              type: 'info'
            }
          });

    expect(r).to.have.deep.property('counter', 2);
    expect(r).to.have.deep.property('2.text', 'Run the tests');
    expect(r).to.have.deep.property('2.type', 'info');
    expect(r).to.have.deep.property('2.timestamp');

    r = banners({
      counter: 2,
      2: {
        text: 'Run the tests',
        type: 'info',
        timestamp: 5000
      }
    }, {
      type: ActionType.BANNER_ADD,
      banner: {
        text: 'Run more tests',
        type: 'error'
      }
    });

    expect(r).to.have.deep.property('counter', 3);
    expect(r[2]).to.eql({
        text: 'Run the tests',
        type: 'info',
        timestamp: 5000
    });
    expect(r).to.have.deep.property('3.text', 'Run more tests');
    expect(r).to.have.deep.property('3.type', 'error');
    expect(r).to.have.deep.property('3.timestamp');
  });

  it('should handle BANNER_DELETE', () => {
    expect(
      banners({
        counter: 2,
        2: {
          text: 'Run the tests',
          type: 'info',
          timestamp: 5000
        }
      }, {
        type: ActionType.BANNER_DELETE,
        id: 2
      })
    ).to.eql({
      counter: 2
    });

    expect(
      banners({
        counter: 2,
        2: {
          text: 'Run the tests',
          type: 'info',
          timestamp: 5000
        }
      }, {
        type: ActionType.BANNER_DELETE,
        id: 3
      })
    ).to.eql({
      counter: 2,
      2: {
        text: 'Run the tests',
        type: 'info',
        timestamp: 5000
      }
    });
  });
});
